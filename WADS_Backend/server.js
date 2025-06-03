import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import http from "http";
import swaggerUi from "swagger-ui-express";
import connectDB from "./config/db.js";
import ticketRoutes from "./routes/ticket.route.js";
import userRoutes from "./routes/user.route.js";
import notificationRoutes from "./routes/notification.route.js";
import departmentRoutes from "./routes/department.route.js";
import auditRoutes from "./routes/audit.route.js";
import exportRoutes from "./routes/export.route.js";
import feedbackRoutes from "./routes/feedback.route.js";
import chatRoutes from "./routes/chat.routes.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import analyticRoutes from "./routes/analytic.route.js";
import twoFactorRoutes from "./routes/twoFactor.route.js";
import messageRoutes from "./routes/message.route.js";
import errorHandler from "./middleware/errorHandler.js";
import session from "express-session";
import passport from "./middleware/auth.js";
import responseTimeLogger from "./middleware/responseTimeLogger.js";
import uptimeLogger from "./middleware/uptimeLogger.js";
import authRoutes from "./routes/auth.route.js";
import { initializeSocket } from "./socket/index.js";
import User from "./models/user.model.js";

import { specs } from "./config/swagger.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

// Load environment variables
// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3010;
app.set("trust proxy", true);

const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);
app.set("io", io);

// Middleware
app.use(helmet());
// app.use(cors()); //VALUE BEFORE CHANGED TO CREDENTIALS:TRUE
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(responseTimeLogger);
app.use(uptimeLogger);

// Request logging in development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Parse JSON request body
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Initialize session middleware
app.use(
  session({
    secret: process.env.JWT_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth routes
app.get(
  "/api/users/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

app.get("/api/users/auth/google/callback", (req, res, next) => {
  passport.authenticate(
    "google",
    {
      failureRedirect: "/login",
      session: false,
    },
    async (err, user, info) => {
      try {
        if (err) {
          console.error("Google OAuth Error:", err);
          return res.redirect("http://localhost:5173/login");
        }
        if (!user) {
          return res.redirect("http://localhost:5173/login");
        }

        // Generate new tokens
        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "12h",
        });
        const refreshToken = jwt.sign(
          { id: user._id },
          process.env.REFRESH_TOKEN_SECRET,
          {
            expiresIn: "7d",
          }
        );

        // Save refresh token to user
        user.refreshToken = refreshToken;
        await user.save();

        // Set refresh token cookie
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "Lax",
          path: "/",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Get the frontend callback URL from state
        const frontendCallbackUrl =
          req.query.state || "http://localhost:5173/auth/google/callback";

        // Prepare user data with the new access token
        const userData = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture,
          accessToken: accessToken, // Use the newly generated access token
        };

        // Redirect to frontend with user data
        const redirectUrl = `${frontendCallbackUrl}?userData=${encodeURIComponent(
          JSON.stringify(userData)
        )}`;
        return res.redirect(redirectUrl);
      } catch (error) {
        console.error("Token Generation Error:", error);
        return res.redirect("http://localhost:5173/login");
      }
    }
  )(req, res, next);
});

// API Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Semesta Medika API Documentation",
  })
);

// API routes
app.use("/api/tickets", ticketRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/audits", auditRoutes);
app.use("/api/exports", exportRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticRoutes);
app.use("/api/2fa", twoFactorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use(errorHandler);

// MongoDB connection and server startup
if (process.env.NODE_ENV !== "test") {
  connectDB()
    .then(() => {
      server.listen(PORT, () =>
        console.log(`🚀 Server running on http://localhost:${PORT}`)
      );
    })
    .catch((error) => {
      console.error(`Failed to connect to database: ${error.message}`);
      process.exit(1);
    });
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});

export default app;
