//
// **Module Imports**
//
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config({ path: "./.env" });
//
// **App Configuration**
//
const app = express();
app.use(cors());
app.use(express.json());
//
// **PORT and JWT_SECRET Processing**
//
const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;
//
// **MongoDB Connection**
//
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
//
// **Function To Run Backend Server**
//
async function run() {
  try {
    await client.connect();
    //
    // **MongoDB Collection**
    //
    const bookCollections = client
      .db("BookInventory")
      .collection("books");
    const userCollection = client
      .db("BookInventory")
      .collection("users");
    const notificationCollection = client
      .db("BookInventory")
      .collection("notification");
    //------Middleware Section------
    // **Middleware Firebase Admin Custom Claim**
    //
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          type: process.env.FIREBASE_TYPE,
          project_id: process.env.FIREBASE_PROJECT_ID,
          private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
          private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          client_id: process.env.FIREBASE_CLIENT_ID,
          auth_uri: process.env.FIREBASE_AUTH_URI,
          token_uri: process.env.FIREBASE_TOKEN_URI,
          auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
          client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
          universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
        }),
      });
    }
    const setAdminPrivileges = async (uid) => {
      try {
        await admin.auth().setCustomUserClaims(uid, { admin: true });
      }
      catch {
        res
          .status(500)
          .json({ message: "Admin Claims Not Permitted" });
      }
    };
    setAdminPrivileges(process.env.ADMIN_UID);
    //
    // **JWT authentication Middleware**
    //
    const authenticate = (req, res, next) => {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res
          .status(403)
          .send({ message: "No token provided" });
      }
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          return res
            .status(403)
            .send({ message: "Invalid or expired token" });
        }
        if (!decoded.userId || !decoded.uid) {
          return res
            .status(403)
            .send({ message: "Invalid token payload" });
        }
        req.userId = decoded.userId;
        req.uid = decoded.uid;
        next();
      });
    };
    //
    // **Admin authentication Middleware**
    //
    const verifyAdmin = async (req, res, next) => {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res
          .status(403)
          .json({ message: "Unauthorized: No token provided" });
      }
      try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        if (decodedToken.admin) {
          next();
        }
        else {
          return res
            .status(403)
            .json({ message: "Unauthorized: Admin privileges required" });
        }
      }
      catch {
        return res
          .status(403)
          .json({ message: "Unauthorized: Invalid token" });
      }
    };



    //------Login, Signup and Validation Endpoints Section------
    // **Signup Endpoint**
    //
    app.post("/signup", async (req, res) => {
      const { username, email, password, uid } = req.body;
      if (!password) {
        return res
          .status(400)
          .send({ message: "Password is required" });
      }
      try {
        const existingUser = await userCollection.findOne({ email });
        if (existingUser) {
          return res
            .status(400)
            .send({ message: "User already exists with this email" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
          uid,
          username,
          email,
          password: hashedPassword,
          likedBooks: [],
          personalBooks: [],
          reviews: [],
          createdAt: new Date(),
          role: "user",
          cart: [],
          order: [],
          orderHistory: [],
          profileImage: "https://avatarfiles.alphacoders.com/793/79317.png",
        };
        const result = await userCollection.insertOne(newUser);
        res
          .status(201)
          .send({ message: "User registered successfully", userId: result.insertedId });
      }
      catch {
        res
          .status(500)
          .send({ message: "An error occurred during signup" });
      }
    });
    //
    // **login Endpoint**
    //
    app.post("/login", async (req, res) => {
      const { email, password } = req.body;
      try {
        const user = await userCollection.findOne({ email });
        if (!user) {
          return res
            .status(400)
            .send({ message: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res
            .status(400)
            .send({ message: "Invalid password" });
        }
        const token = jwt.sign(
          { userId: user._id, uid: user.uid },
          JWT_SECRET,
          { expiresIn: "1h" }
        );
        res
          .send({ message: "Login successful", token });
      }
      catch {
        res
          .status(500)
          .send({ message: "An error occurred during login" });
      }
    });
    //
    // **username check Endpoint**
    //
    app.post("/check-username", async (req, res) => {
      const { email, username } = req.body;
      try {
        const user = await userCollection.findOne({ email });
        if (!user) {
          return res
            .status(404)
            .json({ message: "User not found" });
        }
        const storedUsername = user.username.toLowerCase();
        const inputUsername = username.toLowerCase();
        if (storedUsername !== inputUsername) {
          return res
            .status(400)
            .json({ message: "Username does not match" });
        }
        res
          .status(200)
          .json({ exists: true });
      }
      catch (err) {
        res
          .status(500)
          .json({ message: err.message });
      }
    });
    //
    // **Username And Email Availability Check**
    //
    app.post("/availability-check", async (req, res) => {
      const { username, email } = req.body;
      try {
        if (!username && !email) {
          return res
            .status(400)
            .json({ message: "Username or email is required." });
        }
        const errors = {};
        if (username) {
          const existingUserByUsername = await userCollection.findOne({
            username: { $regex: `^${username}$`, $options: "i" }
          });
          if (existingUserByUsername) {
            errors.username = "Username is already taken.";
          }
        }
        if (email) {
          const existingUserByEmail = await userCollection.findOne({
            email: { $regex: `^${email}$`, $options: "i" }
          });
          if (existingUserByEmail) {
            errors.email = "Email is already registered.";
          }
        }
        if (Object.keys(errors).length > 0) {
          return res
            .status(409)
            .json({ errors });
        }
        res
          .status(200)
          .json({ message: "Username and email are available." });
      }
      catch {
        res
          .status(500)
          .json({ message: "Server error." });
      }
    });
    //
    // **Update Password After Reset Endpoint**
    //
    app.put("/update-password", async (req, res) => {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .send({ message: "Email and password are required" });
      }
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await userCollection.updateOne(
          { email: email.toLowerCase() },
          { $set: { password: hashedPassword } }
        );
        if (result.modifiedCount === 0) {
          return res
            .status(404)
            .send({ message: "User not found or password not updated" });
        }
        const user = await userCollection.findOne({
          email: email.toLowerCase(),
        });
        if (!user) {
          return res
            .status(404)
            .send({ message: "User not found" });
        }
        const token = jwt.sign(
          { userId: user._id, email: user.email, uid: user.uid },
          JWT_SECRET,
          { expiresIn: "1h" }
        );
        return res
          .status(200)
          .send({ message: "Password updated successfully", token });
      }
      catch {
        return res
          .status(500)
          .send({ message: "Internal server error" });
      }
    });



    //------User Endpoints Section------
    // **Endpoint Get User UID**
    //
    app.get("/user/:uid", async (req, res) => {
      const { uid } = req.params;
      try {
        const user = await userCollection.findOne(
          { uid },
          { projection: { password: 0 } }
        );
        if (!user) {
          return res
            .status(404)
            .json({ message: "User not found" });
        }
        return res
          .status(200)
          .json(user);
      }
      catch {
        return res
          .status(500)
          .json({ message: "Internal server error" });
      }
    });
    //
    // **Endpoint For Getting All User**
    //
    app.get("/all-users", async (req, res) => {
      try {
        const users = await userCollection.find().toArray();
        if (users.length === 0) {
          return res
            .status(404)
            .send({ message: "No users found" });
        }
        res
          .send(users);
      }
      catch {
        res
          .status(500)
          .send({ message: "An error occurred while fetching data" });
      }
    });
    //
    // **Endpoint Deleting User From MongoDB**
    //
    app.delete("/delete/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      try {
        const result = await userCollection.deleteOne(filter);
        if (result.deletedCount === 0) {
          return res
            .status(404)
            .send({ message: "User not found for deletion" });
        }
        res
          .send({
            message: "User deleted successfully",
            deletedCount: result.deletedCount,
          });
      }
      catch {
        res
          .status(500)
          .send({ message: "An error occurred while deleting User" });
      }
    });
    //
    // **Endpoint For Deleting User From Firebase**
    //
    app.delete("/firebase-user/:uid", verifyAdmin, async (req, res) => {
      const { uid } = req.params;
      try {
        await admin.auth().deleteUser(uid);
        res
          .status(200)
          .json({ message: "User deleted successfully" });
      }
      catch {
        res
          .status(500)
          .json({ message: "An error occurred while deleting User" });
      }
    });



    //------Cart Endpoint Section------
    // **Endpoint For Adding Book To The Cart**
    //
    app.post("/cart/add", authenticate, async (req, res) => {
      const { bookId } = req.body;
      const userId = req.userId;
      if (!bookId) {
        return res
          .status(400)
          .json({ message: "Book ID is required." });
      }
      try {
        const user = await userCollection.findOne({
          _id: new ObjectId(userId),
        });
        if (!user) {
          return res
            .status(404)
            .json({ message: "User not found." });
        }
        if (!user.cart) {
          user.cart = [];
        }
        const existingCartItem = user.cart.find(
          (item) => item.bookId.toString() === bookId
        );
        if (existingCartItem) {
          const result = await userCollection.updateOne(
            { _id: new ObjectId(userId), "cart.bookId": new ObjectId(bookId) },
            { $inc: { "cart.$.quantity": 1 } }
          );
          if (result.modifiedCount === 0) {
            return res
              .status(500)
              .json({ message: "Failed to update cart." });
          }
          return res
            .json({ message: "Book quantity updated in cart." });
        }
        const result = await userCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $push: { cart: { bookId: new ObjectId(bookId), quantity: 1 } } }
        );
        if (result.modifiedCount === 0) {
          return res
            .status(500)
            .json({ message: "Failed to add book to cart." });
        }
        res
          .json({ message: "Book added to cart." });
      }
      catch {
        res
          .status(500)
          .json({ message: "Failed to add book to cart." });
      }
    });
    //
    // **Endpoint For Removing Book From Cart**
    //
    app.delete("/cart/remove", authenticate, async (req, res) => {
      const { bookId } = req.body;
      const userId = req.userId;
      if (!bookId) {
        return res
          .status(400)
          .send({ message: "Book ID is required" });
      }
      try {
        const result = await userCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $pull: { cart: { bookId: new ObjectId(bookId) } } }
        );
        if (result.modifiedCount === 0) {
          return res
            .status(404)
            .send({ message: "Book not found in cart or user not found" });
        }
        res
          .send({ message: "Book removed from cart successfully" });
      }
      catch {
        res
          .status(500)
          .send({ message: "An error occurred while removing from the cart" });
      }
    });
    //
    // **Endpoint For Increasing And Decreasing Item On The Cart**
    //
    app.patch("/cart/update", authenticate, async (req, res) => {
      const { bookId, quantity } = req.body;
      const userId = req.userId;
      if (!bookId || quantity == null) {
        return res
          .status(400)
          .send({ message: "Book ID and quantity are required" });
      }
      try {
        const result = await userCollection.updateOne(
          { _id: new ObjectId(userId), "cart.bookId": new ObjectId(bookId) },
          { $set: { "cart.$.quantity": quantity } }
        );
        if (result.modifiedCount === 0) {
          return res
            .status(404)
            .send({ message: "Book not found in cart or user not found" });
        }
        res
          .send({ message: "Cart updated successfully" });
      }
      catch {
        res
          .status(500)
          .send({ message: "An error occurred while updating the cart" });
      }
    });
    //
    // **Endpoint For Getting Cart Data From User**
    //
    app.get("/cart", authenticate, async (req, res) => {
      const userId = req.userId;
      try {
        const user = await userCollection.findOne(
          { _id: new ObjectId(userId) },
          { projection: { cart: 1 } }
        );
        if (!user || !user.cart) {
          return res
            .status(200)
            .send({ cart: [] });
        }
        const cartItems = await Promise.all(
          user.cart.map(async (item) => {
            const book = await bookCollections.findOne(
              { _id: new ObjectId(item.bookId) },
              { projection: { title: 1, authorName: 1, price: 1, imageURL: 1 } },
            );
            if (book) {
              return { ...item, ...book };
            }
            else {
              return null;
            }
          }),
        );
        res
          .status(200)
          .send({ cart: cartItems.filter(Boolean) });
      }
      catch {
        res
          .status(500)
          .send({ message: "An error occurred while fetching the cart." });
      }
    });



    //------Orders Endpoint Section------
    // **Endpoint For Adding Orders**
    //
    app.post("/order/add", authenticate, async (req, res) => {
      const userId = req.userId;
      const uid = req.uid;
      const { address, notes, paymentDetails } = req.body;
      try {
        const user = await userCollection.findOne(
          { _id: new ObjectId(userId) },
          { projection: { cart: 1 } }
        );
        if (!user || !user.cart || user.cart.length === 0) {
          return res
            .status(400)
            .json({ message: "Cart is empty or user not found" });
        }
        const { v4: uuidv4 } = require("uuid");
        const newOrder = {
          orderId: uuidv4(),
          orderDate: new Date(),
          uid,
          items: user.cart,
          address,
          notes,
          paymentDetails,
          status: "pending",
        };
        const result = await userCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $push: { order: newOrder }, $set: { cart: [] } }
        );
        if (result.modifiedCount === 0) {
          return res
            .status(500)
            .json({ message: "Failed to place order" });
        }
        res
          .status(200)
          .json({ message: "Order placed successfully", order: newOrder });
      }
      catch {
        res
          .status(500)
          .json({ message: "Failed to place order" });
      }
    });
    //
    // **Endpoint For Deleting Orders (Admin)**
    //
    app.delete("/delete-order/:orderId", verifyAdmin, async (req, res) => {
      const { orderId } = req.params;
      try {
        const result = await userCollection.updateOne(
          { "order.orderId": orderId },
          { $pull: { order: { orderId } } }
        );
        if (result.modifiedCount === 0) {
          return res
            .status(404)
            .json({ message: "Order not found or already deleted" });
        }
        res
          .status(200)
          .json({ message: "Order deleted successfully" });
      }
      catch {
        res
          .status(500)
          .json({ message: "Internal server error" });
      }
    });
    //
    // **Endpoint For Getting All Orders**
    //
    app.get("/all-orders", async (req, res) => {
      try {
        const users = await userCollection.find().toArray();
        const allOrders = users.flatMap((user) => (user.order || []).map((order) => ({
          username: user.username,
          email: user.email,
          orderId: order.orderId,
          orderDate: order.orderDate,
          items: order.items,
          address: order.address,
          paymentDetails: order.paymentDetails,
          status: order.status,
        }))
        );
        if (allOrders.length === 0) {
          return res
            .status(404)
            .send({ message: "No orders found" });
        }
        res
          .send(allOrders);
      }
      catch {
        res
          .status(500)
          .send({ message: "An error occurred while fetching orders" });
      }
    });
    //
    // **Endpoint For Getting Orders of Logged User**
    //
    app.get("/my-orders", authenticate, async (req, res) => {
      try {
        const userId = req.userId;
        const user = await userCollection.findOne(
          { _id: new ObjectId(userId) }
        );
        if (!user) {
          return res
            .status(404)
            .send({ message: 'User not found' });
        }
        const userOrders = (user.order || []).map((order) => ({
          username: user.username,
          email: user.email,
          orderId: order.orderId,
          orderDate: order.orderDate,
          items: order.items,
          address: order.address,
          notes: order.notes,
          paymentDetails: order.paymentDetails,
          status: order.status,
        })
        );
        if (userOrders.length === 0) {
          return res
            .status(404)
            .send({ message: 'No orders found for this user' });
        }
        res
          .send(userOrders);
      }
      catch {
        res
          .status(500)
          .send({ message: 'An error occurred while fetching your orders' });
      }
    });
    //
    // **Endpoint For Approving Orders**
    //
    app.put("/approve-order/:orderId", verifyAdmin, async (req, res) => {
      const { orderId } = req.params;
      try {
        const order = await userCollection.findOne(
          { "order.orderId": orderId }
        );
        if (!order) {
          return res
            .status(404)
            .send({ message: "Order not found" });
        }
        const result = await userCollection.updateOne(
          { "order.orderId": orderId },
          { $set: { "order.$.status": "approved" } }
        );
        const notification = {
          uid: order.uid,
          message: `Your order with ID ${orderId} has been approved!`,
          read: false,
          timestamp: new Date(),
        };
        await notificationCollection.insertOne(notification);
        res
          .send({ message: "Order approved successfully" });
      }
      catch {
        res
          .status(500)
          .send({ message: "An error occurred while approving the order" });
      }
    });
    //
    // **Endpoint For Canceling Orders**
    //
    app.patch('/cancel-order/:orderId', authenticate, async (req, res) => {
      const { orderId } = req.params;
      try {
        const user = await userCollection.findOne(
          { "order.orderId": orderId }
        );
        if (!user) {
          return res
            .status(404)
            .json({ message: 'Order not found.' });
        }
        const orderIndex = user.order.findIndex((o) => o.orderId === orderId);
        if (orderIndex === -1) {
          return res
            .status(404)
            .json({ message: 'Order not found in user.' });
        }
        const selectedOrder = user.order[orderIndex];
        if (!['pending', 'approved'].includes(selectedOrder.status)) {
          return res
            .status(400)
            .json({ message: 'Only pending or approved orders can be cancelled.' });
        }
        user.order[orderIndex].status = 'canceled';
        await userCollection.updateOne(
          { _id: user._id },
          { $set: { [`order.${orderIndex}.status`]: 'canceled' } }
        );
        res
          .status(200)
          .json({ message: 'Order canceled successfully.' });
      }
      catch {
        res
          .status(500)
          .json({ message: 'Internal server error.' });
      }
    });
    //
    // **Endpoint For Deleting Logged User Order (User)**
    //
    app.delete('/delete-my-order/:orderId', authenticate, async (req, res) => {
      const { orderId } = req.params;
      try {
        const user = await userCollection.findOne(
          { "order.orderId": orderId }
        );
        if (!user) {
          return res
            .status(404)
            .json({ message: 'Order not found.' });
        }
        await userCollection.updateOne(
          { _id: user._id },
          { $pull: { order: { orderId: orderId } } }
        );
        res
          .status(200)
          .json({ message: 'Order deleted successfully.' });
      }
      catch {
        res
          .status(500)
          .json({ message: 'Internal server error.' });
      }
    });



    //------Notification Endpoint Section------
    // **Endpoint For Fetching Unreaded Notification**
    //
    app.get("/notifications/:uid", async (req, res) => {
      const { uid } = req.params;
      try {
        const notifications = await notificationCollection
          .find({ uid, read: false })
          .sort({ timestamp: -1 })
          .toArray();
        res
          .send(notifications);
      }
      catch {
        res
          .status(500)
          .send({ message: "An error occurred while fetching notifications" });
      }
    });
    //
    // **Endpoint For Fetching Readed Notification**
    //
    app.get("/notifications/readed/:uid", async (req, res) => {
      const { uid } = req.params;
      try {
        const notifications = await notificationCollection
          .find({ uid, read: true })
          .sort({ timestamp: -1 })
          .toArray();
        res
          .send(notifications);
      }
      catch {
        res
          .status(500)
          .send({ message: "An error occurred while fetching notifications" });
      }
    });
    //
    // **Endpoint For Deleting Notification**
    //
    app.delete('/notifications/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const result = await notificationCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
          return res
            .status(404)
            .send({ message: 'Notification not found' });
        }
        res
          .send({ message: 'Notification deleted successfully' });
      }
      catch {
        res
          .status(500)
          .send({ message: 'Internal Server Error' });
      }
    });
    //
    // **Endpoint For Marking Single Notification as Readed**
    //
    app.put("/mark-notification-read/:id", async (req, res) => {
      const { id } = req.params;
      try {
        const result = await notificationCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { read: true } }
        );
        if (result.matchedCount === 0) {
          return res
            .status(404)
            .send({ message: "Notification not found" });
        }
        res
          .send({ message: "Notification marked as read" });
      }
      catch {
        res
          .status(500)
          .send({ message: "An error occurred while marking the notification" });
      }
    });
    //
    // **Endpoint For Marking All Notification as Readed**
    //
    app.put("/mark-all-read/:uid", async (req, res) => {
      const { uid } = req.params;
      try {
        const result = await notificationCollection.updateMany(
          { uid: uid, read: false },
          { $set: { read: true } }
        );
        if (result.modifiedCount === 0) {
          return res
            .status(404)
            .send({ message: "No unread notifications found" });
        }
        res
          .send({ message: "All notifications marked as read" });
      }
      catch {
        res
          .status(500)
          .send({ message: "An error occurred while marking notifications" });
      }
    });



    //------Review and Feedback Endpoint Section------
    // **Endpoint For Adding Review and Feedback**
    //
    app.post("/users/:uid/add-review", async (req, res) => {
      const { uid } = req.params;
      const { review } = req.body;
      try {
        const reviewWithId = { ...review, _id: new ObjectId() };
        const user = await userCollection.findOneAndUpdate(
          { uid },
          { $push: { reviews: reviewWithId } },
          { new: true }
        );
        if (!user) {
          return res
            .status(404)
            .json({ message: "User not found." });
        }
        res
          .status(200)
          .json({ message: "Review added successfully.", review: reviewWithId, user });
      }
      catch {
        res
          .status(500)
          .json({ message: "An error occurred while adding the review." });
      }
    });
    //
    // **Endpoint For Fetching all Feedback and Review**
    //
    app.get("/all-feedback", async (req, res) => {
      try {
        const users = await userCollection.find().toArray();
        const allFeedback = users.flatMap((user) => (user.reviews || []).map((review) => ({
          ...review,
          profileImage: user.profileImage
        }))
        );
        if (allFeedback.length === 0) {
          return res
            .status(404)
            .send({ message: "No feedback found" });
        }
        res
          .send(allFeedback);
      }
      catch {
        res
          .status(500)
          .send({ message: "An error occurred while fetching feedback" });
      }
    });



    //------Counting Endpoint Section------
    // **Endpoint For Counting Total User**
    //
    app.get("/count-all-users", async (req, res) => {
      try {
        const userCount = await userCollection.countDocuments();
        res.send({ count: userCount });
      }
      catch {
        res
          .status(500)
          .send({ message: "An error occurred while counting user" });
      }
    });
    //
    // **Endpoint For Counting Total Books**
    //
    app.get("/count-all-books", async (req, res) => {
      try {
        const bookCount = await bookCollections.countDocuments();
        res.send({ count: bookCount });
      }
      catch {
        res
          .status(500)
          .send({ message: "An error occurred while counting books" });
      }
    });
    //
    // **Endpoint For Counting Total Book Category**
    //
    app.get("/count-book-categories", async (req, res) => {
      try {
        const categories = await bookCollections.aggregate([
          { $unwind: "$category" },
          { $group: { _id: "$category" } },
          { $sort: { _id: 1 } }
        ]).toArray();
        const distinctCategories = categories.map((cat) => cat._id);
        res
          .send({ count: distinctCategories.length });
      }
      catch {
        res
          .status(500)
          .send({ message: "An error occurred while counting book category" });
      }
    });
    //
    // **Endpoint For Counting Total Book Author**
    //
    app.get("/count-authors", async (req, res) => {
      try {
        const authorsCount = await bookCollections.aggregate([
          { $group: { _id: "$authorName" } },
          { $count: "distinctAuthors" }
        ]).toArray();
        const count = authorsCount.length > 0 ? authorsCount[0].distinctAuthors : 0;
        res
          .send({ count });
      }
      catch {
        res
          .status(500)
          .send({ message: "An error occurred while counting book author" });
      }
    });
    //
    // **Endpoint For Counting Total Book Stock**
    //
    app.get("/count-total-stock", async (req, res) => {
      try {
        const totalStock = await bookCollections.aggregate([
          { $group: { _id: null, totalStock: { $sum: "$stock" } } }
        ]).toArray();
        if (totalStock.length > 0) {
          res
            .send({ totalStock: totalStock[0].totalStock });
        }
        else {
          res
            .send({ totalStock: 0 });
        }
      }
      catch {
        res
          .status(500)
          .send({ message: "An error occurred while counting book stocks" });
      }
    });
    //
    // **Endpoint For Counting Total Book Likes**
    //
    app.get("/count-total-likes", async (req, res) => {
      try {
        const totalLikes = await bookCollections.aggregate([
          { $group: { _id: null, totalLikes: { $sum: "$likes" } } }
        ]).toArray();
        if (totalLikes.length > 0) {
          res
            .send({ totalLikes: totalLikes[0].totalLikes });
        }
        else {
          res
            .send({ totalLikes: 0 });
        }
      }
      catch {
        res
          .status(500)
          .send({ message: "An error occurred while counting book likes" });
      }
    });
    //
    // **Endpoint For Counting Total Reviews**
    //
    app.get("/count-user-reviews", async (req, res) => {
      try {
        const reviews = await userCollection.aggregate([
          { $unwind: "$reviews" },
          { $group: { _id: "$reviews" } },
          { $sort: { _id: 1 } }
        ]).toArray();
        const distinctReviews = reviews.map((cat) => cat._id);
        res
          .send({ count: distinctReviews.length });
      }
      catch {
        res
          .status(500)
          .send({ message: "Error fetching user reviews" });
      }
    });
    //
    // **Endpoint For Counting Total Orders**
    //
    app.get("/count-user-order", async (req, res) => {
      try {
        const orders = await userCollection.aggregate([
          { $unwind: "$order" },
          { $group: { _id: "$order" } },
          { $sort: { _id: 1 } }
        ]).toArray();
        const distinctOrders = orders.map((cat) => cat._id);
        res
          .send({ count: distinctOrders.length });
      }
      catch {
        res
          .status(500)
          .send({ message: "Error fetching user order" });
      }
    });



    //------Book Related Endpoint Section------
    // **Endpoint For Uploading Book From Frontend (Single Book)**
    //
    app.post("/upload-book", authenticate, async (req, res) => {
      const data = req.body;
      const userId = req.userId;
      try {
        let result;
        if (Array.isArray(data)) {
          const booksWithObjectId = data.map((book) => ({
            ...book,
            owner: new ObjectId(userId),
          }));
          result = await bookCollections.insertMany(booksWithObjectId);
        }
        else {
          const bookWithObjectId = {
            ...data,
            owner: new ObjectId(userId),
          };
          result = await bookCollections.insertOne(bookWithObjectId);
        }
        res
          .status(201)
          .send({ message: "Books inserted successfully", insertedCount: result.insertedCount });
      }
      catch {
        res
          .status(500)
          .send({ message: "An error occurred while inserting data" });
      }
    });
    //
    // **Endpoint For Fetching Book To Manage, Based On Owner Of The Book**
    //
    app.get("/user-books", authenticate, async (req, res) => {
      try {
        if (req.userId === process.env.SUPER_ADMIN_ID) {
          const books = await bookCollections.find().toArray();
          res
            .status(200)
            .json(books);
        }
        else {
          const books = await bookCollections.find({ owner: new ObjectId(req.userId) }).toArray();
          res
            .status(200)
            .json(books);
        }
      }
      catch {
        res
          .status(500)
          .json({ message: "Failed to fetch books" });
      }
    });
    //
    // **Endpoint For Fetching All Books**
    //
    app.get("/all-books", async (req, res) => {
      try {
        const books = await bookCollections.find().toArray();
        if (books.length === 0) {
          return res
            .status(404)
            .send({ message: "No books found" });
        }
        res
          .send(books);
      }
      catch {
        res
          .status(500)
          .send({ message: "An error occurred while fetching data" });
      }
    });
    //
    // **Endpoint For Editing And Updating Book Data**
    //
    app.patch("/book/:id", async (req, res) => {
      const id = req.params.id;
      const updateBookData = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = { $set: { ...updateBookData } };
      try {
        const result = await bookCollections.updateOne(filter, updateDoc, options);
        if (result.matchedCount === 0) {
          return res
            .status(404)
            .send({ message: "Book not found" });
        }
        res
          .send({ message: "Book updated successfully", modifiedCount: result.modifiedCount });
      }
      catch {
        res
          .status(500)
          .send({ message: "An error occurred while updating data" });
      }
    });
    //
    // **Endpoint For Deleting Book**
    //
    app.delete("/book/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      try {
        const result = await bookCollections.deleteOne(filter);
        if (result.deletedCount === 0) {
          return res
            .status(404)
            .send({ message: "Book not found for deletion" });
        }
        res
          .send({ message: "Book deleted successfully", deletedCount: result.deletedCount });
      }
      catch {
        res
          .status(500)
          .send({ message: "An error occurred while deleting data" });
      }
    });
    //
    // **Endpoint For Searching Book By Category**
    //
    app.get("/books-by-category", async (req, res) => {
      const { category } = req.query;
      const query = category ? { category } : {};
      try {
        const books = await bookCollections.find(query).toArray();
        if (books.length === 0) {
          return res
            .status(404)
            .send({ message: `No books found in category '${category}'` });
        }
        res
          .send(books);
      }
      catch {
        res
          .status(500)
          .send({ message: "An error occurred while fetching data" });
      }
    });
    //
    // **Endpoint For Fetching Single Book**
    //
    app.get("/book/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      try {
        const book = await bookCollections.findOne(filter);
        if (!book) {
          return res
            .status(404)
            .send({ message: "Book not found" });
        }
        res
          .send(book);
      }
      catch {
        res
          .status(500)
          .send({ message: "An error occurred while fetching data" });
      }
    });
    //
    // **Endpoint For Fetching User Liked Book (Id Only)**
    //
    app.get("/liked", authenticate, async (req, res) => {
      try {
        const userId = req.userId;
        const user = await userCollection.findOne(
          { _id: new ObjectId(userId) },
          { projection: { likedBooks: 1 } }
        );
        if (!user) {
          return res
            .status(404)
            .json({ message: "User not found" });
        }
        res
          .status(200)
          .json({ likedBooks: user.likedBooks || [] });
      }
      catch {
        res
          .status(500)
          .json({ message: "Internal server error." });
      }
    });
    //
    // **Endpoint For Fetching User Liked Book (Full Book Data Only)**
    //
    app.get("/liked-books", authenticate, async (req, res) => {
      try {
        const userId = req.userId;
        const user = await userCollection.findOne(
          { _id: new ObjectId(userId) },
          { projection: { likedBooks: 1 } }
        );
        if (!user) {
          return res
            .status(404)
            .json({ message: "User not found" });
        }
        const likedBookIds = user.likedBooks || [];
        if (likedBookIds.length === 0) {
          return res
            .status(200)
            .json({ likedBooks: [] });
        }
        const likedBookIdsObject = likedBookIds.map(id => typeof id === 'string' ? new ObjectId(id) : id);
        const likedBooks = await bookCollections.find(
          { _id: { $in: likedBookIdsObject } }
        ).toArray();
        res
          .status(200)
          .json({ likedBooks });
      }
      catch {
        res
          .status(500)
          .json({ message: "Internal server error." });
      }
    });
    //
    // **Endpoint For Toggling Like and Unlike**
    //
    app.post("/book/:id/likes", authenticate, async (req, res) => {
      const bookId = req.params.id;
      const userId = req.userId;
      try {
        const user = await userCollection.findOne({
          _id: new ObjectId(userId),
        });
        const book = await bookCollections.findOne({
          _id: new ObjectId(bookId),
        });
        if (!user || !book) {
          return res
            .status(404)
            .send({ message: "User or Book not found" });
        }
        const isLiked = user.likedBooks.some((likedBookId) => likedBookId.toString() === bookId);
        if (isLiked) {
          await userCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $pull: { likedBooks: new ObjectId(bookId) } }
          );
          await bookCollections.updateOne(
            { _id: new ObjectId(bookId) },
            { $inc: { likes: -1 } }
          );
        }
        else {
          await userCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $addToSet: { likedBooks: new ObjectId(bookId) } }
          );
          await bookCollections.updateOne(
            { _id: new ObjectId(bookId) },
            { $inc: { likes: 1 } }
          );
        }
        const updatedLikes = await bookCollections.findOne(
          { _id: new ObjectId(bookId) },
          { projection: { likes: 1 } }
        );
        res
          .send({ liked: !isLiked, likes: updatedLikes.likes });
      }
      catch {
        res
          .status(500)
          .send({ message: "An error occurred." });
      }
    });
    //
    // **Endpoint For Fetching Total Likes Single Book**
    //
    app.get("/book/:id/likes", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      try {
        const book = await bookCollections.findOne(filter, { projection: { likes: 1 } });
        if (!book) {
          return res
            .status(404)
            .send({ message: "Book not found" });
        }
        res
          .send({ likes: book.likes || 0 });
      }
      catch {
        res
          .status(500)
          .send({ message: "An error occurred while fetching likes" });
      }
    });
    //
    // **Endpoint For Fetching Single Book Likes Count**
    //
    app.get("/top-books", async (req, res) => {
      try {
        const topBooks = await bookCollections.find({}).sort({ likes: -1 }).limit(15).toArray();
        res
          .send(topBooks);
      }
      catch {
        res
          .status(500)
          .send({ message: "An error occurred while fetching top books" });
      }
    });



    //
    // Ping the MongoDB admin database to verify the connection before starting the server.
    //
    await client.db("admin").command({ ping: 1 });
  } finally {
  }
}

run().catch(console.dir);

app.listen(PORT, () => {
  console.log(`MongoDB Connection Established, Server is running on port ${PORT}`);
});