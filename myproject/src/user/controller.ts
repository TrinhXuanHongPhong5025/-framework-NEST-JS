import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController {

  @Get()
  getUsers() {
    return [
      {
        id: 1,
        name: 'Nguyen Van A',
        email: 'vana@gmail.com',
        company: 'Phenikaa'
      },
      {
        id: 2,
        name: 'Tran Thi B',
        email: 'tranb@gmail.com',
        company: 'Google'
      },
      {
        id: 3,
        name: 'Le Van C',
        email: 'levanc@gmail.com',
        company: 'Microsoft'
      },
      {
        id: 4,
        name: 'Pham Thi D',
        email: 'phamd@gmail.com',
        company: 'Apple'
      }
    ];
  }
}