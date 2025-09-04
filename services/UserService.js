import bcrypt from 'bcrypt';
import UserRepository from '../repositories/user.repository.js';

const SALT_ROUNDS = 10;

export default class UserService {
    constructor() {
        this.repository = new UserRepository();
    }

    async createUser(data) {
        try {
            const exist = await this.repository.findByEmail(data.email);
            if (exist) {
                return { error: 'El email ya está registrado' };
            }

            const hashedPassword = bcrypt.hashSync(data.password, SALT_ROUNDS);

            const user = await this.repository.create({
                ...data,
                password: hashedPassword,
            });

            return user;
        } catch (err) {
            console.error('Error al crear usuario:', err);
            return { error: 'Error al crear usuario' };
        }
    }

    async getByEmail(email) {
        return await this.repository.findByEmail(email);
    }

    async getUserById(id) {
        return await this.repository.findById(id);
    }

    async updateUser(id, data) {
        return await this.repository.updateById(id, data);
    }

    validatePassword(user, plain) {
        return bcrypt.compareSync(plain, user.password);
    }

    async updatePassword(userId, newPlain) {
        const hashed = bcrypt.hashSync(newPlain, SALT_ROUNDS);
        return await this.repository.updateById(userId, { password: hashed });
    }

    async isSamePassword(user, plain) {
        return bcrypt.compareSync(plain, user.password);
    }
}
