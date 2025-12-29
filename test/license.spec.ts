import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { App } from 'supertest/types'
import { AppModule } from '../src/app.module'
import { Logger } from 'winston'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'

describe('LicenseController', () => {
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

  describe('/api/licenses (POST)', () => {
    it('should successfully create a new license', async () => {
      const uniqueCode = `LIC-TEST-${Date.now()}`
      const response = await request(app.getHttpServer()).post('/api/licenses').send({
        code: uniqueCode,
        qty: 10,
      })

      logger.info(response.body)

      expect(response.status).toBe(201)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body.data).toBeDefined() // eslint-disable-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.data.id).toBeDefined() // eslint-disable-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.data.code).toBe(uniqueCode) // eslint-disable-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.data.qty).toBe(10) // eslint-disable-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.data.createdBy).toBe('system') // eslint-disable-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.data.isDeleted).toBe(false) // eslint-disable-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.data.createdDate).toBeDefined() // eslint-disable-line @typescript-eslint/no-unsafe-member-access
    })

    it('should successfully create a license with zero quantity', async () => {
      const uniqueCode = `LIC-ZERO-${Date.now()}`
      const response = await request(app.getHttpServer()).post('/api/licenses').send({
        code: uniqueCode,
        qty: 0,
      })

      logger.info(response.body)

      expect(response.status).toBe(201)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body.data).toBeDefined() // eslint-disable-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.data.qty).toBe(0) // eslint-disable-line @typescript-eslint/no-unsafe-member-access
    })

    it('should successfully create a license with large quantity', async () => {
      const uniqueCode = `LIC-LARGE-${Date.now()}`
      const response = await request(app.getHttpServer()).post('/api/licenses').send({
        code: uniqueCode,
        qty: 10000,
      })

      logger.info(response.body)

      expect(response.status).toBe(201)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body.data).toBeDefined() // eslint-disable-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.data.qty).toBe(10000) // eslint-disable-line @typescript-eslint/no-unsafe-member-access
    })

    it('should reject if license code already exists', async () => {
      const duplicateCode = `LIC-DUP-${Date.now()}`

      // Create first license
      await request(app.getHttpServer()).post('/api/licenses').send({
        code: duplicateCode,
        qty: 5,
      })

      // Try to create duplicate
      const response = await request(app.getHttpServer()).post('/api/licenses').send({
        code: duplicateCode,
        qty: 10,
      })

      logger.info(response.body)

      expect(response.status).toBe(400)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body.errors).toBeDefined() // eslint-disable-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.errors).toBe('license already exists') // eslint-disable-line @typescript-eslint/no-unsafe-member-access
    })

    it('should reject if code is missing', async () => {
      const response = await request(app.getHttpServer()).post('/api/licenses').send({
        qty: 10,
      })

      logger.info(response.body)

      expect(response.status).toBe(400)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body.errors).toBeDefined() // eslint-disable-line @typescript-eslint/no-unsafe-member-access
    })

    it('should reject if quantity is missing', async () => {
      const response = await request(app.getHttpServer()).post('/api/licenses').send({
        code: `LIC-NO-QTY-${Date.now()}`,
      })

      logger.info(response.body)

      expect(response.status).toBe(400)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body.errors).toBeDefined() // eslint-disable-line @typescript-eslint/no-unsafe-member-access
    })

    it('should reject if code is empty string', async () => {
      const response = await request(app.getHttpServer()).post('/api/licenses').send({
        code: '',
        qty: 10,
      })

      logger.info(response.body)

      expect(response.status).toBe(400)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body.errors).toBeDefined() // eslint-disable-line @typescript-eslint/no-unsafe-member-access
    })

    it('should reject if quantity is negative', async () => {
      const response = await request(app.getHttpServer()).post('/api/licenses').send({
        code: `LIC-NEG-${Date.now()}`,
        qty: -5,
      })

      logger.info(response.body)

      expect(response.status).toBe(400)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body.errors).toBeDefined() // eslint-disable-line @typescript-eslint/no-unsafe-member-access
    })

    it('should reject if quantity is not a number', async () => {
      const response = await request(app.getHttpServer()).post('/api/licenses').send({
        code: `LIC-NAN-${Date.now()}`,
        qty: 'invalid',
      })

      logger.info(response.body)

      expect(response.status).toBe(400)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body.errors).toBeDefined() // eslint-disable-line @typescript-eslint/no-unsafe-member-access
    })

    it('should reject if code type is not a string', async () => {
      const response = await request(app.getHttpServer()).post('/api/licenses').send({
        code: 12345,
        qty: 10,
      })

      logger.info(response.body)

      expect(response.status).toBe(400)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body.errors).toBeDefined() // eslint-disable-line @typescript-eslint/no-unsafe-member-access
    })
  })
})
