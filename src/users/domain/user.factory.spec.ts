import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { User } from './user';
import { UserFactory } from './user.factory';

describe('UserFactory', () => {
  let userFactory: UserFactory;
  let eventBus: jest.Mocked<EventBus>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserFactory,
        { provide: EventBus, useValue: { publish: jest.fn() } },
      ],
    }).compile();
    userFactory = module.get(UserFactory);
    eventBus = module.get(EventBus);
  });

  describe('create', () => {
    it('should create user', () => {
      // Given

      // When
      const user = userFactory.create(
        'user-id',
        'user-name',
        'user@email.com',
        'signup-verify-token',
        'password12',
      );

      // Then
      const expected = new User(
        'user-id',
        'user-name',
        'user@email.com',
        'password12',
        'signup-verify-token',
      );
      expect(expected).toEqual(user);
      expect(eventBus.publish).toBeCalledTimes(1);
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute user', () => {
      // Given

      // When
      const user = userFactory.reconstitute(
        'user-id',
        'user-name',
        'user@email.com',
        'signup-verify-token',
        'password12',
      );

      // Then
      const expected = new User(
        'user-id',
        'user-name',
        'user@email.com',
        'password12',
        'signup-verify-token',
      );
      expect(expected).toEqual(user);
    });
  });
});
