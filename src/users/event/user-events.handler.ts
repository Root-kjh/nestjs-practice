import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailService } from 'src/email/email.service';
import { UserCreatedEvent } from './user-created.event';

@EventsHandler(UserCreatedEvent)
export class UserEventsHandler implements IEventHandler<UserCreatedEvent> {
  constructor(private emailService: EmailService) {}

  async handle(event: UserCreatedEvent) {
    switch (event.name) {
      case UserCreatedEvent.name:
        const { email, signupVerifyToken } = event;
        await this.emailService.sendMemberJoinVerification(
          email,
          signupVerifyToken,
        );
        break;

      default:
        break;
    }
  }
}
