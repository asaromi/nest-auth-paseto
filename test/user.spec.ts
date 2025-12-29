import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { App } from 'supertest/types'
import { AppModule } from '../src/app.module'
import { Logger } from 'winston'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'

describe('UserController', () => {
  let app: INestApplication<App>
  let logger: Logger

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    logger = app.get(WINSTON_MODULE_PROVIDER)
  })

  afterEach(async () => {
    await app.close()
  })

  describe('/api/users (POST) - Success Cases', () => {
    it('should successfully register a new user', async () => {
      const uniqueUsername = `testuser_${Date.now()}`
      const response = await request(app.getHttpServer()).post('/api/users').send({
        username: uniqueUsername,
        password: 'password123',
        fullName: 'Test User Success',
      })

      logger.info(response.body)

      expect(response.status).toBe(201)
      expect(response.body).toBeInstanceOf(Object)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.data).toBeDefined()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.data.id).toBeDefined()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.data.username).toBe(uniqueUsername)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.data.fullName).toBe('Test User Success')
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.data.password).toBeDefined()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.data.password).not.toBe('password123') // Password should be hashed
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.data.createdDate).toBeDefined()
    })

    it('should successfully register a user with minimum length username', async () => {
      const uniqueUsername = `u${Date.now()}`
      const response = await request(app.getHttpServer()).post('/api/users').send({
        username: uniqueUsername,
        password: 'password123',
        fullName: 'Short Username',
      })

      logger.info(response.body)

      expect(response.status).toBe(201)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.data).toBeDefined()
    })

    it('should successfully register a user with long valid name', async () => {
      const uniqueUsername = `longname_${Date.now()}`
      const longName = 'A'.repeat(60)
      const response = await request(app.getHttpServer()).post('/api/users').send({
        username: uniqueUsername,
        password: 'password123',
        fullName: longName,
      })

      logger.info(response.body)

      expect(response.status).toBe(201)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.data).toBeDefined()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.data.fullName).toBe(longName)
    })

    it('should reject duplicate username registration', async () => {
      const duplicateUsername = `duplicate_${Date.now()}`

      // First registration
      await request(app.getHttpServer()).post('/api/users').send({
        username: duplicateUsername,
        password: 'password123',
        fullName: 'First User',
      })

      // Attempt duplicate registration
      const response = await request(app.getHttpServer()).post('/api/users').send({
        username: duplicateUsername,
        password: 'password456',
        fullName: 'Second User',
      })

      logger.info(response.body)

      expect(response.status).toBe(400)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.errors).toBe('username already exists')
    })
  })

  describe('/api/users (POST) - Validation Error Cases', () => {
    it('should be rejected if request body is invalid', async () => {
      const response = await request(app.getHttpServer()).post('/api/users').send({
        username: 'test',
      })

      logger.info(response.body)

      expect(response.body).toBeInstanceOf(Object)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response?.body?.errors).toBeDefined()
      expect(response.status).toBe(400)
    })

    it('should be rejected if password is too short', async () => {
      const response = await request(app.getHttpServer()).post('/api/users').send({
        username: 'testuser',
        password: 'short',
        fullName: 'Test User',
      })

      logger.info(response.body)

      expect(response.body).toBeInstanceOf(Object)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response?.body?.errors).toBeDefined()
      expect(response.status).toBe(400)
    })

    it('should be rejected if username is empty', async () => {
      const response = await request(app.getHttpServer()).post('/api/users').send({
        username: '',
        password: 'password123',
        fullName: 'Test User',
      })

      logger.info(response.body)

      expect(response.body).toBeInstanceOf(Object)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response?.body?.errors).toBeDefined()
      expect(response.status).toBe(400)
    })

    it('should be rejected if username is too long', async () => {
      const longUsername = 'a'.repeat(129)

      const response = await request(app.getHttpServer()).post('/api/users').send({
        username: longUsername,
        password: 'password123',
        fullName: 'Test User',
      })

      logger.info(response.body)

      expect(response.body).toBeInstanceOf(Object)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response?.body?.errors).toBeDefined()
      expect(response.status).toBe(400)
    })

    it('should be rejected if username has wrong type (number)', async () => {
      const response = await request(app.getHttpServer()).post('/api/users').send({
        username: 12345,
        password: 'password123',
        fullName: 'Test User',
      })

      logger.info(response.body)

      expect(response.body).toBeInstanceOf(Object)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response?.body?.errors).toBeDefined()
      expect(response.status).toBe(400)
    })

    it('should be rejected if fullName is empty', async () => {
      const response = await request(app.getHttpServer()).post('/api/users').send({
        username: 'testuser',
        password: 'password123',
        fullName: '',
      })

      logger.info(response.body)

      expect(response.body).toBeInstanceOf(Object)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response?.body?.errors).toBeDefined()
      expect(response.status).toBe(400)
    })

    it('should be rejected if fullName is too long', async () => {
      const longFullName = 'a'.repeat(129)

      const response = await request(app.getHttpServer()).post('/api/users').send({
        username: 'testuser',
        password: 'password123',
        fullName: longFullName,
      })

      logger.info(response.body)

      expect(response.body).toBeInstanceOf(Object)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response?.body?.errors).toBeDefined()
      expect(response.status).toBe(400)
    })

    it('should be rejected if fullName has wrong type (number)', async () => {
      const response = await request(app.getHttpServer()).post('/api/users').send({
        username: 'testuser',
        password: 'password123',
        fullName: 9876,
      })

      logger.info(response.body)

      expect(response.body).toBeInstanceOf(Object)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response?.body?.errors).toBeDefined()
      expect(response.status).toBe(400)
    })

    it('should be rejected if password has wrong type (number)', async () => {
      const response = await request(app.getHttpServer()).post('/api/users').send({
        username: 'testuser',
        password: 12345678,
        fullName: 'Test User',
      })

      logger.info(response.body)

      expect(response.body).toBeInstanceOf(Object)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response?.body?.errors).toBeDefined()
      expect(response.status).toBe(400)
    })

    it('should be rejected if password is empty string', async () => {
      const response = await request(app.getHttpServer()).post('/api/users').send({
        username: 'testuser',
        password: '',
        fullName: 'Test User',
      })

      logger.info(response.body)

      expect(response.body).toBeInstanceOf(Object)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response?.body?.errors).toBeDefined()
      expect(response.status).toBe(400)
    })
  })
})
