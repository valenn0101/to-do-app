import { validate } from 'class-validator';
import { UserDTO } from '../../users/dto/user.dto';

describe('UserDTO', () => {
  it('Validar usuario correcto', async () => {
    const user = new UserDTO();
    user.firstName = 'John';
    user.lastName = 'Doe';
    user.age = 30;
    user.email = 'j@j.com';
    user.username = 'john';
    user.password = '123';

    const errors = await validate(user);
    expect(errors.length).toBe(0);
  });

  it('Deberia fallar ya que existe un campo incompleto', async () => {
    const user = new UserDTO();

    const errors = await validate(user);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('Deberia fallar ya que el tipo de dato no es correcto', async () => {
    const user = new UserDTO();
    user.firstName = 'John';
    //@ts-ignore
    user.lastName = 123;
    //@ts-ignore
    user.age = '25';
    user.email = 'john.doe@example.com';
    user.username = 'johndoe';
    user.password = 'password123';

    const errors = await validate(user);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });
});
