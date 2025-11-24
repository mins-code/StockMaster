import { Router } from 'express';
import { prisma } from './prisma.js'; // Updated import
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const authRouter = Router();
// POST /register
authRouter.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create the user with default role 'STAFF'
        const newUser = await prisma.user.create({
            data: {
                email,
                passwordHash: hashedPassword,
                role: 'STAFF',
                isActive: true,
            },
        });
        res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id, email: newUser.email } });
    }
    catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// POST /login
authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find the user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        // Generate JWT token
        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.status(200).json({ message: 'Login successful', token });
    }
    catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
export default authRouter;
//# sourceMappingURL=auth.routes.js.map