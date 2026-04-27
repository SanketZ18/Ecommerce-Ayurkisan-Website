package com.ayurkisan.Modules.Cart;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.ayurkisan.model.Product;
import com.ayurkisan.service.ProductService;
import com.ayurkisan.Modules.Packages.ProductPackage;
import com.ayurkisan.Modules.Packages.ProductPackageService;
import com.ayurkisan.util.FinanceCalculator;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductPackageService packageService;

    public Cart getCart(String userId, String role) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> createEmptyCart(userId, role));
    }

    private Cart createEmptyCart(String userId, String role) {
        Cart newCart = new Cart();
        newCart.setUserId(userId);
        newCart.setRole(role);
        return cartRepository.save(newCart);
    }

    public Cart addToCart(String userId, String role, String itemId, String itemType, int requestedQuantity) {
        if (requestedQuantity <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity must be greater than 0");
        }

        Cart cart = getCart(userId, role);

        // Check stock and calculate prices based on item type and role
        int physicalQuantity = requestedQuantity;
        double originalPrice = 0.0;
        double discountedPrice = 0.0;
        String itemName = "";
        String itemImage = "";
        String weight = null;

        if ("PRODUCT".equalsIgnoreCase(itemType)) {
            if (itemId == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Item ID is required");
            }
            Product product = productService.getProductById(itemId);
            itemName = product.getProductName();
            itemImage = product.getProductImage1();
            weight = product.getWeight();

            if ("Retailer".equalsIgnoreCase(role)) {
                // Retailer buys in boxes (1 box = 10 products)
                physicalQuantity = requestedQuantity * 10;
            }

            if (product.getStockQuantity() < physicalQuantity) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient stock. Available: " + product.getStockQuantity());
            }

            originalPrice = product.getPrice();
            // Default 0% discount if not set by admin
            double discountPct = product.getDiscount();
            discountedPrice = originalPrice - (originalPrice * discountPct / 100.0);

        } else if ("PACKAGE".equalsIgnoreCase(itemType)) {
            if (itemId == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Item ID is required");
            }
            ProductPackage pkg = packageService.getPackageById(itemId);
            itemName = pkg.getName();
            itemImage = pkg.getImageURL();
            
            originalPrice = pkg.getTotalPrice();
            discountedPrice = pkg.getPackagePrice();
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid item type: " + itemType);
        }

        if ("Retailer".equalsIgnoreCase(role)) {
            discountedPrice = discountedPrice * 0.7; // Fixed 30% discount for retailers on wholesale boxes
        } else if ("Customer".equalsIgnoreCase(role)) {
            discountedPrice = discountedPrice * 0.9; // Fixed 10% discount for customers
        }

        // Add to cart items list
        Optional<CartItem> existingItemOpt = cart.getItems().stream()
                .filter(i -> i.getProductId().equals(itemId) && i.getItemType().equalsIgnoreCase(itemType))
                .findFirst();

        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + physicalQuantity);
            existingItem.setDiscountedPrice(discountedPrice);
            existingItem.setWeight(weight);
            
            // Re-verify stock for PRODUCT
            if ("PRODUCT".equalsIgnoreCase(itemType)) {
                Product product = productService.getProductById(itemId);
                if (product.getStockQuantity() < existingItem.getQuantity()) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient stock to add more.");
                }
            }
            
            existingItem.setTotalItemPrice(existingItem.getDiscountedPrice() * existingItem.getQuantity());
        } else {
            CartItem newItem = new CartItem();
            newItem.setProductId(itemId);
            newItem.setProductName(itemName);
            newItem.setProductImage(itemImage);
            newItem.setItemType(itemType.toUpperCase());
            newItem.setQuantity(physicalQuantity);
            newItem.setPrice(originalPrice);
            newItem.setDiscountedPrice(discountedPrice);
            newItem.setTotalItemPrice(discountedPrice * physicalQuantity);
            newItem.setWeight(weight);
            
            cart.getItems().add(newItem);
        }

        recalculateTotals(cart);
        return cartRepository.save(cart);
    }

    public Cart updateQuantity(String userId, String role, String itemId, String itemType, int requestedQuantity) {
        if (requestedQuantity <= 0) {
            return removeFromCart(userId, itemId, itemType);
        }

        Cart cart = getCart(userId, role);

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProductId().equals(itemId) && i.getItemType().equalsIgnoreCase(itemType))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found in cart"));

        int physicalQuantity = requestedQuantity;
        if ("PRODUCT".equalsIgnoreCase(itemType) && "Retailer".equalsIgnoreCase(cart.getRole())) {
            // Retailer manages in boxes (1 box = 10 products)
            physicalQuantity = requestedQuantity * 10;
        }

        if ("PRODUCT".equalsIgnoreCase(itemType)) {
            Product product = productService.getProductById(itemId);
            if (product.getStockQuantity() < physicalQuantity) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient stock. Available: " + product.getStockQuantity());
            }
        }

        item.setQuantity(physicalQuantity);
        item.setTotalItemPrice(item.getDiscountedPrice() * physicalQuantity);

        recalculateTotals(cart);
        return cartRepository.save(cart);
    }

    public Cart removeFromCart(String userId, String itemId, String itemType) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart not found"));

        cart.getItems().removeIf(i -> i.getProductId().equals(itemId) && i.getItemType().equalsIgnoreCase(itemType));

        recalculateTotals(cart);
        return cartRepository.save(cart);
    }

    public void clearCart(String userId) {
        Cart cart = cartRepository.findByUserId(userId).orElse(null);
        if (cart != null) {
            cart.getItems().clear();
            cart.setTotalOriginalPrice(0.0);
            cart.setTotalDiscountedPrice(0.0);
            cartRepository.save(cart);
        }
    }

    public void checkoutCart(String userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cart is empty");
        }

        // 1. Verify and reduce stock atomically
        for (CartItem item : cart.getItems()) {
            if ("PRODUCT".equalsIgnoreCase(item.getItemType())) {
                // To fetch the actual MongoDB ID, we need to find the product by name.
                // product service reduceStockAtomically takes the DB ID object _id.
                Product product = productService.getProductById(item.getProductId());
                boolean success = productService.reduceStockAtomically(product.getId(), item.getQuantity());
                if (!success) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to reduce stock for " + item.getProductName());
                }
            } else if ("PACKAGE".equalsIgnoreCase(item.getItemType())) {
                // reduceStockAtomically throws ResponseStatusException internally on insufficient stock
                packageService.reduceStockAtomically(item.getProductId(), item.getQuantity());
            }
        }

        // 2. Clear cart
        clearCart(userId);
    }

    private void recalculateTotals(Cart cart) {
        double totalOriginal = 0;
        double totalDiscounted = 0;

        for (CartItem item : cart.getItems()) {
            totalOriginal += (item.getPrice() * item.getQuantity());
            totalDiscounted += item.getTotalItemPrice();
        }

        cart.setTotalOriginalPrice(FinanceCalculator.round(totalOriginal));
        cart.setTotalDiscountedPrice(FinanceCalculator.round(totalDiscounted));

        // Use core calculator to estimate GST and final price for the user
        FinanceCalculator.FinanceSummary estimate = FinanceCalculator.calculateFullOrder(
                totalDiscounted, 
                0.0, // Promo discount estimated at 0 in cart before coupon entry
                FinanceCalculator.FLAT_DELIVERY_CHARGE
        );

        cart.setEstimatedGst(estimate.gstAmount);
        cart.setTotalPayable(estimate.totalPayable);
    }
}
