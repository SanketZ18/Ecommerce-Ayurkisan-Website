
## Swagger URL -
http://localhost:9090/swagger-ui/index.html

## AYURKISAN BACKEND – API ROUTES DOCUMENT
Base URL - http://localhost:9090

### 🔐 AUTH MODULE
1️⃣ **Customer Signup** - POST - `/api/auth/customer/signup`
Request Body:
```json
{
  "name": "John Doe",
  "email": "john@gmail.com",
  "phoneNumber": "9876543210",
  "address": "Pune",
  "password": "john123"
}
```

2️⃣ **Retailer Signup** - POST - `/api/auth/retailer/signup`
Request Body:
```json
{
  "retailerName": "Ramesh",
  "firmName": "Ramesh Agro",
  "registrationId": "REG123",
  "address": "Mumbai",
  "phoneNumber": "9876543210",
  "email": "retailer@gmail.com",
  "password": "retailer123"
}
```

3️⃣ **Admin Registration** - POST - `/api/auth/admin/register`
Request Body:
```json
{
  "name": "Super Admin",
  "email": "admin@gmail.com",
  "phoneNumber": "9876543210",
  "address": "Pune",
  "password": "admin123"
}
```

4️⃣ **Login** - POST - `/api/auth/login`
Request Body:
```json
{
  "email": "admin@gmail.com",
  "password": "admin123",
  "role": "ADMIN" 
}
```
*(Roles: CUSTOMER, RETAILER, ADMIN)*

---

### 🛡️ ADMIN MODULE
1️⃣ **View All Customers** - GET - `/api/admin/customers`
2️⃣ **View All Retailers** - GET - `/api/admin/retailers`
3️⃣ **Recover Customer** - PUT - `/api/admin/recover/customer/{id}`
4️⃣ **Recover Retailer** - PUT - `/api/admin/recover/retailer/{id}`
5️⃣ **Update Admin** - PUT - `/api/admin/update/{id}`
6️⃣ **Delete Admin** - DELETE - `/api/admin/delete/{id}`
7️⃣ **View All Admins** - GET - `/api/admin/admins`
8️⃣ **Dashboard Stats** - GET - `/api/admin/dashboard-stats`

---

### 👤 CUSTOMER MODULE
1️⃣ **Get All Customers** - GET - `/api/customer/all`
2️⃣ **Get Customer by ID** - GET - `/api/customer/{id}`
3️⃣ **Update Profile** - PUT - `/api/customer/update/{id}`
4️⃣ **Soft Delete** - DELETE - `/api/customer/delete/{id}`
5️⃣ **Change Password** - PUT - `/api/customer/change-password/{id}`

---

### 🏪 RETAILER MODULE
1️⃣ **Get All Retailers** - GET - `/api/retailer/all`
2️⃣ **Get Retailer by ID** - GET - `/api/retailer/{id}`
3️⃣ **Update Profile** - PUT - `/api/retailer/update/{id}`
4️⃣ **Soft Delete** - DELETE - `/api/retailer/delete/{id}`
5️⃣ **Change Password** - PUT - `/api/retailer/change-password/{id}`

---

### 📦 PRODUCT MODULE
1️⃣ **Add Product (Admin)** - POST - `/products/admin/add`
**Example Registration Payload:**
```json
{
  "productName": "Ashwagandha KSM-66 Root Extract",
  "description": "High-potency organic Ashwagandha capsules designed to support stress relief.",
  "brand": "Herbal Vitality Co.",
  "price": 2500.00,
  "discount": 10.0,
  "stockQuantity": 500,
  "productImage1": "https://example.com/img1.jpg",
  "productImage2": "https://example.com/img2.jpg",
  "productImage3": "https://example.com/img3.jpg",
  "categoryId": "cat-stress-001",
  "piecesPerBox": 10,
  "customerDiscount": 10.0,
  "retailerDiscount": 30.0,
  "discountEnabled": true,
  "ingredients": "Organic Ashwagandha, Black Pepper",
  "usageInstructions": "Two capsules daily",
  "dosage": "500mg per capsule",
  "sideEffects": "None common",
  "expiryDate": "2028-12-31",
  "manufacturingDate": "2026-01-01",
  "weight": "150g",
  "isPrescriptionRequired": false
}
```

2️⃣ **Update Product (Admin)** - PUT - `/products/admin/update/{id}`
3️⃣ **Delete Product (Admin)** - DELETE - `/products/admin/delete/{id}`
4️⃣ **Get All Products** - GET - `/products/all`
5️⃣ **Get Product by ID** - GET - `/products/id/{id}`
6️⃣ **Out of Stock Products** - GET - `/products/admin/out-of-stock`

---

### 📑 CATEGORY MODULE
1️⃣ **Add Category (Admin)** - POST - `/categories/admin/add`
2️⃣ **Update Category (Admin)** - PUT - `/categories/admin/update/{categoryName}`
3️⃣ **Delete Category (Admin)** - DELETE - `/categories/admin/delete/{categoryName}`
4️⃣ **Get All Active Categories** - GET - `/categories/all`
5️⃣ **Get Category by Name** - GET - `/categories/view/{categoryName}`

---

### 🎁 PRODUCT PACKAGE MODULE
1️⃣ **Add Package (Admin)** - POST - `/packages/admin/add`
Payload Example:
```json
{
  "name": "Immunity Booster Pack",
  "items": [
    { "productId": "prod123", "quantity": 1 },
    { "productId": "prod456", "quantity": 2 }
  ],
  "packagePrice": 1200.0,
  "totalPrice": 1500.0,
  "imageURL": "https://example.com/package.jpg",
  "active": true
}
```
2️⃣ **Update Package (Admin)** - PUT - `/packages/admin/update/{packageName}`
3️⃣ **Delete Package (Admin)** - DELETE - `/packages/admin/delete/{packageName}`
4️⃣ **Get All Packages** - GET - `/packages/all`
5️⃣ **Get Package by Name** - GET - `/packages/view/{packageName}`

---

### 🛒 CART MODULE
1️⃣ **Get My Cart** - GET - `/cart/{userId}?role={ROLE}`
2️⃣ **Add Item** - POST - `/cart/add?userId={uid}&role={ROLE}&itemId={id}&itemType={PRODUCT/PACKAGE}&quantity={q}`
3️⃣ **Update Quantity** - PUT - `/cart/update?userId={uid}&role={ROLE}&itemId={id}&itemType={PRODUCT/PACKAGE}&quantity={q}`
4️⃣ **Remove Item** - DELETE - `/cart/remove/{userId}/{itemId}/{itemType}`
5️⃣ **Clear Cart** - DELETE - `/cart/clear/{userId}`
6️⃣ **Checkout** - POST - `/cart/checkout/{userId}`

---

### 📦 ORDER MODULE
1️⃣ **Place Order** - POST - `/orders/place-order?paymentMethod=COD&customName=...&customPhone=...&customAddress=...`
*(Authorization: Bearer <JWT>)*
2️⃣ **My Orders** - GET - `/orders/my-orders`
3️⃣ **Cancel Order** - PUT - `/orders/cancel/{orderId}`
4️⃣ **All Orders (Admin)** - GET - `/orders/admin/all`
5️⃣ **Update Status (Admin)** - PUT - `/orders/admin/status/{orderId}?newStatus=SHIPPED`

---

### 📧 CONTACT MODULE
1️⃣ **Submit Form** - POST - `/api/contact/submit`
2️⃣ **View All (Admin)** - GET - `/api/contact/all`
3️⃣ **Reply (Admin)** - POST - `/api/contact/reply/{id}`
4️⃣ **Delete Message (Admin)** - DELETE - `/api/contact/{id}`

---

### 🏠 HOMEPAGE SECTIONS
1️⃣ **Get All Sections** - GET - `/api/homepage/sections`
2️⃣ **Get by Type** - GET - `/api/homepage/sections/type/{type}`
3️⃣ **Create Section** - POST - `/api/homepage/sections`
4️⃣ **Update Section** - PUT - `/api/homepage/sections/{id}`
5️⃣ **Delete Section** - DELETE - `/api/homepage/sections/{id}`

---

### 📊 REPORT MODULE (ADMIN)
1️⃣ **Sales Report** - GET - `/api/reports/sales?start={ISO}&end={ISO}`
2️⃣ **Product Sales Report** - GET - `/api/reports/products`
3️⃣ **Package Sales Report** - GET - `/api/reports/packages`
4️⃣ **Detailed Product History** - GET - `/api/reports/products/{productId}`
5️⃣ **Dashboard Overview** - GET - `/api/reports/dashboard-stats`
6️⃣ **Export Data**:
   - `GET /api/reports/export/products/csv`
   - `GET /api/reports/export/products/excel`
   - `GET /api/reports/export/products/pdf`

---

### 🚚 SHIPMENT MODULE
1️⃣ **Track Shipment** - GET - `/shipments/track/{orderId}`
2️⃣ **All Shipments (Admin)** - GET - `/shipments/admin/all`
3️⃣ **Update Status (Admin)** - PUT - `/shipments/admin/status/{orderId}?newStatus={STATUS}&remarks={msg}`

---

### 🔄 RETURN MODULE
1️⃣ **Request Return** - POST - `/returns/request/{orderId}?reason={msg}&comments={msg}`
2️⃣ **My Returns** - GET - `/returns/my-returns`
3️⃣ **Track Return** - GET - `/returns/track/{orderId}`
4️⃣ **All Returns (Admin)** - GET - `/returns/admin/all`
5️⃣ **Update Return Status (Admin)** - PUT - `/returns/admin/status/{orderId}?newStatus={STATUS}&remarks={msg}`
*(Admin can set statuses: ACCEPTED, REJECTED, PICKED_UP, REFUNDED)*
```