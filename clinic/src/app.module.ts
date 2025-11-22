import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PatientsModule } from './patients/patients.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',     
      port: 3306,
      username: 'clinic_user',
      password: 'abcd1234', 
      database: 'clinic_db',
      autoLoadEntities: true, 
      synchronize: false,      
    }),

    PatientsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}