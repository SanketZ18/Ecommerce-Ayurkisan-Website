package com.ayurkisan.Modules.Cart;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin("*")
@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/{userId}")
    public Cart getCart(@PathVariable String userId, @RequestParam String role) {
        return cartService.getCart(userId, role);
    }

    @PostMapping("/add")
    public Cart addToCart(@RequestParam String userId,
                          @RequestParam String role,
                          @RequestParam String itemId,
                          @RequestParam String itemType,
                          @RequestParam int quantity) {
        return cartService.addToCart(userId, role, itemId, itemType, quantity);
    }

    @PutMapping("/update")
    public Cart updateQuantity(@RequestParam String userId,
                               @RequestParam String itemId,
                               @RequestParam String itemType,
                               @RequestParam int quantity) {
        return cartService.updateQuantity(userId, itemId, itemType, quantity);
    }

    @DeleteMapping("/remove/{userId}/{itemId}/{itemType}")
    public Cart removeFromCart(@PathVariable String userId,
                               @PathVariable String itemId,
                               @PathVariable String itemType) {
        return cartService.removeFromCart(userId, itemId, itemType);
    }

    @DeleteMapping("/clear/{userId}")
    public Map<String, String> clearCart(@PathVariable String userId) {
        cartService.clearCart(userId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Cart cleared successfully");
        return response;
    }

    @PostMapping("/checkout/{userId}")
    public Map<String, String> checkout(@PathVariable String userId) {
        cartService.checkoutCart(userId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Checkout successful.");
        return response;
    }
}
