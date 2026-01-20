import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication (e2e)', () => {
    let app: INestApplication;
    let authToken: string;

    const testUser = {
        email: 'test@example.com',
        password: 'TestPass123!',
        firstName: 'Test',
        lastName: 'User',
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );

        app.setGlobalPrefix('api/v1');

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/api/v1/auth/register (POST)', () => {
        it('should register a new user', () => {
            return request(app.getHttpServer())
                .post('/api/v1/auth/register')
                .send(testUser)
                .expect(201)
                .expect((res) => {
                    expect(res.body.data.user).toBeDefined();
                    expect(res.body.data.user.email).toBe(testUser.email);
                    expect(res.body.data.accessToken).toBeDefined();
                    expect(res.body.data.refreshToken).toBeDefined();
                });
        });

        it('should fail with duplicate email', () => {
            return request(app.getHttpServer())
                .post('/api/v1/auth/register')
                .send(testUser)
                .expect(409);
        });

        it('should fail with invalid email', () => {
            return request(app.getHttpServer())
                .post('/api/v1/auth/register')
                .send({ ...testUser, email: 'invalid-email' })
                .expect(400);
        });
    });

    describe('/api/v1/auth/login (POST)', () => {
        it('should login with correct credentials', () => {
            return request(app.getHttpServer())
                .post('/api/v1/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password,
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.data.user).toBeDefined();
                    expect(res.body.data.accessToken).toBeDefined();
                    expect(res.body.data.refreshToken).toBeDefined();
                    authToken = res.body.data.accessToken;
                });
        });

        it('should fail with incorrect password', () => {
            return request(app.getHttpServer())
                .post('/api/v1/auth/login')
                .send({
                    email: testUser.email,
                    password: 'WrongPassword123!',
                })
                .expect(401);
        });
    });

    describe('/api/v1/auth/validate (POST)', () => {
        it('should validate token', () => {
            return request(app.getHttpServer())
                .post('/api/v1/auth/validate')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
        });

        it('should fail without token', () => {
            return request(app.getHttpServer())
                .post('/api/v1/auth/validate')
                .expect(401);
        });
    });

    describe('/api/v1/users/me (GET)', () => {
        it('should get current user profile', () => {
            return request(app.getHttpServer())
                .get('/api/v1/users/me')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.data.email).toBe(testUser.email);
                });
        });
    });

    describe('/api/v1/health (GET)', () => {
        it('should return health status', () => {
            return request(app.getHttpServer())
                .get('/api/v1/health')
                .expect(200)
                .expect((res) => {
                    expect(res.body.status).toBe('ok');
                });
        });
    });
});
