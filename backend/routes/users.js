const express = require('express');
const { ObjectId } = require('mongodb');
const { checkParams, checkBody } = require('../validation/validator');
const { userScheme, idScheme } = require('../validation/scheme');
const { getUsersCollection } = require('../database/db');
const { requireAuth } = require('../validation/auth');
const logger = require('../logs/logger');

const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Получить всех пользователей
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список всех пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Неавторизованный доступ
 */

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const users = await getUsersCollection().find({}).toArray();
    res.send({ users });
  } catch (err) {
    err.status = 500;
    next(err);
  }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Создать нового пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Пользователь создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 status:
 *                   type: string
 *       401:
 *         description: Неавторизованный доступ
 */

router.post('/', requireAuth, checkBody(userScheme), async (req, res, next) => {
  try {
    const result = await getUsersCollection().insertOne(req.body);
    res.send({ id: result.insertedId, status: 'user created' });
  } catch (err) {
    err.status = 500;
    next(err);
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Получить пользователя по ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Найденный пользователь
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *       401:
 *         description: Неавторизованный доступ
 *       400:
 *         description: Неверный формат ID
 */

router.get('/:id', requireAuth, checkParams(idScheme), async (req, res, next) => {
  try {
    const user = await getUsersCollection().findOne({ _id: new ObjectId(req.params.id) });
    res.send({ user });
  } catch (err) {
    err.status = 500;
    next(err);
  }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Обновить данные пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Пользователь обновлён
 *       404:
 *         description: Пользователь не найден
 *       401:
 *         description: Неавторизованный доступ
 */

router.put('/:id', requireAuth, checkParams(idScheme), checkBody(userScheme), async (req, res, next) => {
  try {
    const result = await getUsersCollection().updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    if (!result.matchedCount) {
      const err = new Error('Пользователь не найден');
      err.status = 404;
      return next(err);
    }
    const user = await getUsersCollection().findOne({ _id: new ObjectId(req.params.id) });
    res.send({ user, status: 'updated' });
  } catch (err) {
    err.status = 500;
    next(err);
  }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Удалить пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Пользователь удалён
 *       404:
 *         description: Пользователь не найден
 *       401:
 *         description: Неавторизованный доступ
 */

router.delete('/:id', requireAuth, checkParams(idScheme), async (req, res, next) => {
  try {
    const result = await getUsersCollection().deleteOne({ _id: new ObjectId(req.params.id) });
    if (!result.deletedCount) {
      const err = new Error('Пользователь не найден');
      err.status = 404;
      return next(err);
    }
    res.send({ status: 'removed' });
  } catch (err) {
    err.status = 500;
    next(err);
  }
});

module.exports = router;
