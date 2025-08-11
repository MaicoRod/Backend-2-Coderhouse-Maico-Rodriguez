import bcrypt from 'bcrypt';
import UserModel from '../models/UserModel.js';

const SALT_ROUNDS = 10;

class UserService {
    async createUser(data) {
        try {
            const exist = await UserModel.findOne({email: data.email});
            if (exist) return { error:'Este email ya se encuentra registrado'};

            if (!data.password) return {error:'Ingrese la contraseña'}

            const hashed = bcrypt.hashSync(data.password, SALT_ROUNDS);
            const user = await UserModel.create({...data, password: hashed});
            return user;
            
        } catch (error) {
            console.error('Error al crear el usuario:', error)
            return {error:'Error interno en el servidor'}
        }
    }
    
   
    async getUsers({ page = 1, limit = 10}) {
        try {
            const p = parseInt(page), l = parseInt(limit);
            const [docs, total] = await Promise.all([UserModel.find().skip((p-1)*l).limit(l).lean(), UserModel.countDocuments()]);
            return { docs, total, page: p, limit: l};
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            return {error:'Error interno del servidor'};
        }
    }

    async getUserById(id) {
        try {
            const user = await UserModel.findById(id).lean();
            return user || null;
        } catch (error) {
            console.error('Error al obtener el usuario:', error);
            return { error:'Error interno del servidor'};
        }
    }

    async updateUser(id, data){
        try {
            const toUpdate = {...data};
            if (data.password){
                toUpdate.password = bcrypt.hashSync(data.password, SALT_ROUNDS);
            }
            const updated = await UserModel.findByIdAndUpdate(id, toUpdate, {new: true}).lean();
            return updated || null;
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            return { error:'Error interno del servidor'};
        }
    }

    async deleteUser (id) {
        try {
            const deleted = await  UserModel.findByIdAndDelete(id).lean();
            return deleted || null;
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            return { error:'Error interno del servidor'};
        }
    }

    async getByEmail(email){
        try {
            return await UserModel.findOne({email});
        } catch (error) {
            console.error('Error en la busqueda de mail', error);
            return null;
        }
    }

    validatePassword(user, plainPassword){
        return bcrypt.compareSync(plainPassword, user.password);
    }
}

export default UserService;