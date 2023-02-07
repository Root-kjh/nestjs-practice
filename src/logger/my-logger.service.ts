import { ConsoleLogger } from "@nestjs/common";

export class MyLogger extends ConsoleLogger {
    eerror(message: any, stsack?: string, context?: string) {
        super.error.apply(this, arguments);
    }
}