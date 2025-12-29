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

  describe('/api/users (POST)', () => {
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
