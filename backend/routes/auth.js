const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { checkBody } = require('../validation/validator');
const { userScheme, loginScheme } = require('../validation/scheme');
const { getUsersCollection } = require('../database/db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     description: Создаёт нового пользователя и сохраняет его в базу данных
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - secondName
 *               - age
 *               - city
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Ivan
 *               secondName:
 *                 type: string
 *                 example: Ivanov
 *               age:
 *                 type: integer
 *                 example: 30
 *               city:
 *                 type: string
 *                 example: Almaty
 *               email:
 *                 type: string
 *                 example: ivan@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: Успешная регистрация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 60c72b2f9f1b2c001c8e4a3b
 *                 status:
 *                   type: string
 *                   example: registered
 *       400:
 *         description: Пользователь с таким email уже существует или ошибка валидации
 *       500:
 *         description: Ошибка сервера
 */

router.post(
  '/register',
  checkBody(userScheme),
  async (req, res, next) => {
    const users = getUsersCollection();
    const { firstName, secondName, age, city, email, password } = req.body;

    try {
      // Проверка: есть ли такой email уже
      const exists = await users.findOne({ email });
      if (exists) {
        const error = new Error('Пользователь с таким email уже существует');
        error.status = 400;
        return next(error);
      }

      // Хеширование пароля
      const hash = await bcrypt.hash(password, 10);

      // Вставка
      const result = await users.insertOne({
        firstName, secondName, age, city, email,
        password: hash,
      });

      res.status(201).send({ id: result.insertedId.toString(), status: 'registered' });

    } catch (err) {
      if (err.code === 11000) {
        const error = new Error('Пользователь с таким email уже существует');
        error.status = 400;
        return next(error);
      }
      console.error(err);
      const error = new Error('Ошибка регистрации');
      error.status = 500;
      return next(error);
    }
  }
);


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Вход пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Успешный вход
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Неверные email или пароль
 */

router.post(
  '/login',
  checkBody(loginScheme),
  async (req, res, next) => {
    const users = getUsersCollection();
    const { email, password } = req.body;
    try {
      // ищем пользователя по email
      const user = await users.findOne({ email });
      if (!user) {
        const error = new Error('Неверные email или пароль');
        error.status = 401;
        return next(error);
      }
      // сравниваем пароль
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        const error = new Error('Неверные email или пароль');
        error.status = 401;
        return next(error);
      }
      // генерируем токен
      const token = jwt.sign(
        { userId: user._id.toString() },
        JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
      );
      res.send({ token });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
