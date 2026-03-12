
## Swagger URL -
http://localhost:9090/swagger-ui/index.html

## AYURKISAN BACKEND – API ROUTES DOCUMENT
USER APIs-
Base URL - http://localhost:9090
1️⃣ Customer Registration - POST - /api/auth/customer/register
Body Example -
{
  "name": "John Doe",
  "email": "john@gmail.com",
  "phoneNumber": "9876543210",
  "address": "Pune",
  "password": "john123"
}
2️⃣ Retailer Registration - POST - /api/auth/retailer/register
Body Example -
{
  "retailerName": "Ramesh",
  "firmName": "Ramesh Agro",
  "registrationId": "REG123",
  "address": "Mumbai",
  "phoneNumber": "9876543210",
  "email": "retailer@gmail.com",
  "password": "retailer123"
}

3️⃣ Admin Registration - POST - /api/auth/admin/register
Request Body -
{
  "name": "Super Admin",
  "email": "admin@gmail.com",
  "phoneNumber": "9876543210",
  "address": "Pune",
  "password": "admin123"
}

4️⃣ Login (Customer / Retailer / Admin) - POST - /api/auth/login
Request Body -
{
  "email": "admin@gmail.com",
  "password": "admin123",
  "role": "ADMIN"
}

ADMIN MODULE - 
1️⃣ View All Customers - GET - /api/admin/customers
2️⃣ View All Retailers - GET - /api/admin/retailers
3️⃣ Recover Customer - PUT - /api/admin/recover/customer/{id}
4️⃣ Recover Retailer - PUT - /api/admin/recover/retailer/{id}
5️⃣ Update Admin - PUT - /api/admin/update/{id}
Request Body - 
{
  "name": "Updated Name",
  "phoneNumber": "9876543210",
  "address": "Updated Address"
}
6️⃣ Delete Admin - DELETE - /api/admin/delete/{id}
7️⃣ View All Admins - GET - /api/admin/admins

CUSTOMER MODULE APIs - 
1️⃣ Update Customer Profile - PUT - /api/customer/update/{id}
Request Body - 
{
  "name": "Updated Name",
  "phoneNumber": "9876543210",
  "address": "Updated Address"
}

2️⃣ Delete Customer (Soft Delete)- PUT - /api/customer/delete/{id}

RETAILER MODULE APIs -
1️⃣ Update Retailer Profile - PUT - /api/retailer/update/{id}
Request Body
{
  "retailerName": "Ramesh",
  "firmName": "Ramesh Agro",
  "registrationId": "REG123",
  "address": "Mumbai",
  "phoneNumber": "9876543210",
  "email": "retailer@gmail.com",
  "password": "retailer123"
}

2️⃣ Delete Retailer (Soft Delete) - PUT - /api/retailer/delete/{id}

## Product Module APIs-
1️⃣ Add Product - POST - http://localhost:9090/products/admin/add
Body Example -
{
  "id": "herb-7721-ashwa",
  "productName": "Ashwagandha KSM-66 Root Extract",
  "description": "High-potency organic Ashwagandha capsules designed to support stress relief, cortisol balance, and cognitive clarity. Non-GMO and vegan-friendly.",
  "brand": "Herbal Vitality Co.",
  "price": 45.00,
  "discount": 15,
  "finalPrice": 38.25,
  "stockQuantity": 250,
  "productImage": "https://cdn.herbalvitality.com/products/ashwagandha-60.jpg",
  "categoryId": "cat-stress-relief-01",
  "createdAt": "2026-02-21T05:43:09.280Z",
  "piecesPerBox": 60,
  "customerDiscount": 15.00,
  "retailerDiscount": 30.00,
  "discountEnabled": true,
  "ingredients": "Organic Ashwagandha Root Extract (KSM-66), Black Pepper Extract (BioPerine), Vegetable Cellulose Capsule.",
  "usageInstructions": "Take two capsules daily with a glass of water, preferably after a meal.",
  "dosage": "500mg per capsule",
  "sideEffects": "May cause mild drowsiness or digestive upset in rare cases. Not recommended for pregnant women without medical advice.",
  "expiryDate": "2028-02-21",
  "manufacturingDate": "2026-01-15",
  "weight": "120g",
  "prescriptionRequired": false
}

2️⃣ Get Product by ID - GET - http://localhost:9090/products/{id} | Get all Products - GET - http://localhost:9090/products/all

3️⃣ Update Product - PUT - http://localhost:9090/products/admin/update/{id}
Example Body -
{
  "id": "herb-7721-ashwa",
  "productName": "Ashwagandha KSM-66 Root Extract",
  "description": "High-potency organic Ashwagandha capsules designed to support stress relief, cortisol balance, and cognitive clarity. Non-GMO and vegan-friendly.",
  "brand": "Herbal Vitality Co.",
  "price": 45.00,
  "discount": 15,
  "finalPrice": 38.25,
  "stockQuantity": 240,
  "productImage": "https://cdn.herbalvitality.com/products/ashwagandha-60.jpg",
  "categoryId": "cat-stress-relief-01",
  "createdAt": "2026-02-21T05:43:09.280Z",
  "piecesPerBox": 60,
  "customerDiscount": 15.00,
  "retailerDiscount": 30.00,
  "discountEnabled": true,
  "ingredients": "Organic Ashwagandha Root Extract (KSM-66), Black Pepper Extract (BioPerine), Vegetable Cellulose Capsule.",
  "usageInstructions": "Take two capsules daily with a glass of water, preferably after a meal.",
  "dosage": "500mg per capsule",
  "sideEffects": "May cause mild drowsiness or digestive upset in rare cases. Not recommended for pregnant women without medical advice.",
  "expiryDate": "2028-02-21",
  "manufacturingDate": "2026-01-15",
  "weight": "120g",
  "prescriptionRequired": false
}

4️⃣ Delete Product - DELETE - http://localhost:9090/products/admin/delete/{id}

## CATEGORY MODULE Apis-
1️⃣ Add Category (Admin Only) - POST -http://localhost:9090/categories/admin/add
Body Example -
{
  "id": "cat-skincare-202",
  "categoryName": "Therapeutic Skincare",
  "description": "Herbal balms, salves, and oils formulated with botanical extracts to soothe.",
  "active": true
}

2️⃣ Update Category (Admin Only) - PUT - http://localhost:9090/categories/admin/update/{name}
Body Example -
{
  "id": "cat-skincare-202",
  "categoryName": "Therapeutic Skincare",
  "description": "Herbal balms and oils formulated with botanical extracts to soothe.",
  "active": true
}

3️⃣ Delete Category (Admin Only) - DELETE - http://localhost:9090/categories/admin/delete/{name}
4️⃣ Get All Categories - GET - http://localhost:9090/categories/all
5️⃣ Get Categories by Name - GET - 'http://localhost:9090/categories/view/{name}

## PRODUCT PACKAGE MODULE APIs -
1️⃣ Add Product Package (Admin Only) - POST - http://localhost:9090/packages/admin/add
Body Example -
{
  "id": "pkg-skin-003",
  "name": "Ayurvedic Radiance Glow Set",
  "items": [
    {
      "productId": "herb-9902-neem-balm",
      "quantity": 1
    },
    {
      "productId": "herb-2210-rosewater-toner",
      "quantity": 1
    }
  ],
  "bundlePrice": 40.00,
  "compareAtPrice": 48.00,
  "active": true
}

2️⃣ Update Product Package (Admin Only)- PUT - http://localhost:9090/packages/admin/update/{packageName}
Body Example -
{
  "id": "pkg-skin-003",
  "name": "Ayurvedic Radiance Glow Set",
  "items": [
    {
      "productId": "herb-9902-neem-balm",
      "quantity": 1
    },
    {
      "productId": "herb-2210-rosewater-toner",
      "quantity": 1
    }
  ],
  "bundlePrice": 45.00,
  "compareAtPrice": 48.00,
  "active": true
}
3️⃣ Delete Product Package (Admin Only) - DELETE - http://localhost:9090/packages/admin/delete/{packageName}
4️⃣ Get All Product Packages - GET - http://localhost:9090/packages/all
5️⃣ Get Package By Name - GET - http://localhost:9090/packages/view/{packageName}

## FEEDBACK MODULE APIs -
1️⃣ Add Feedback - POST - http://localhost:9090/feedback/add
Body Example -
{
  "productId": "herb-7721-ashwa",
  "rating": 5,
  "comments": "Excellent quality ashwagandha.",
  "suggestions": "Please offer larger pack sizes."
}

2️⃣ Get Feedbacks by Product - GET - http://localhost:9090/feedback/product/{productId}
3️⃣ Get All Feedbacks (Admin) - GET - http://localhost:9090/feedback/admin/all
4️⃣ Get Feedbacks by Role (Admin) - GET - http://localhost:9090/feedback/admin/role/{role}
5️⃣ Delete Feedback - DELETE - http://localhost:9090/feedback/delete/{id}

## CART MODULE APIs -
1️⃣ Add Item to Cart - POST - http://localhost:9090/cart/add
Body Example -
{
  "itemId": "Ashwagandha KSM-66 Root Extract",
  "itemType": "PRODUCT",
  "quantity": 2
}

2️⃣ Get User Cart - GET - http://localhost:9090/cart/my-cart
3️⃣ Update Item Quantity - PUT - http://localhost:9090/cart/update
Body Example -
{
  "itemId": "Ashwagandha KSM-66 Root Extract",
  "itemType": "PRODUCT",
  "quantity": 5
}

4️⃣ Remove Item from Cart - DELETE - http://localhost:9090/cart/remove/{itemId}/{itemType}
5️⃣ Clear Cart - DELETE - http://localhost:9090/cart/clear

## ORDER MODULE APIs -
1️⃣ Place Order - POST - http://localhost:9090/orders/place-order?paymentMethod=COD
*(Note: Requires JWT token in Authorization header e.g., 'Bearer eyJhb...')*

2️⃣ Get My Orders - GET - http://localhost:9090/orders/my-orders
3️⃣ Cancel Order - PUT - http://localhost:9090/orders/cancel/{orderId}
4️⃣ Get All Orders (Admin) - GET - http://localhost:9090/orders/admin/all
5️⃣ Update Order Status (Admin) - PUT - http://localhost:9090/orders/admin/status/{orderId}?newStatus=SHIPPED

## SHIPMENT MODULE APIs -
*(Note: Requires JWT token in Authorization header e.g., 'Bearer eyJhb...')*
1️⃣ Track Shipment - GET - http://localhost:9090/shipments/track/{orderId}
2️⃣ Get All Shipments (Admin) - GET - http://localhost:9090/shipments/admin/all
3️⃣ Update Shipment Status (Admin) - PUT - http://localhost:9090/shipments/admin/status/{orderId}?newStatus=SHIPPED&remarks=Dispatching today
*(Admin can set statuses: CONFIRMED, SHIPPED, OUT_FOR_DELIVERY, DELIVERED)*

## RETURN MODULE APIs -
*(Note: Requires JWT token in Authorization header e.g., 'Bearer eyJhb...')*
1️⃣ Initiate Return - POST - http://localhost:9090/returns/request/{orderId}?reason=Damaged item&comments=Box was open
2️⃣ Get My Returns - GET - http://localhost:9090/returns/my-returns
3️⃣ Track Return - GET - http://localhost:9090/returns/track/{orderId}
4️⃣ Get All Returns (Admin) - GET - http://localhost:9090/returns/admin/all
5️⃣ Update Return Status (Admin) - PUT - http://localhost:9090/returns/admin/status/{orderId}?newStatus=ACCEPTED&remarks=Arranging pickup
*(Admin can set statuses: ACCEPTED, REJECTED, PICKED_UP, REFUNDED)*