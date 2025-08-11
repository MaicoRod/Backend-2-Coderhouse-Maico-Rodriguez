import UserService from '../services/UserService.js';

const userService = new UserService();

export const createUser = async (req, res) => {
    const result = await userService.createUser(req.body);
    if (result?.error) return res.status(400).json(result);
    res.status(201).json(result);
};

export const getUsers = async (req, res) => {
    const result = await userService.getUsers(req.query);
    res.json(result);
};

export const getUserById = async (req, res) => {
    const u = await userService.getUserById(req.params.uid);
    if (!u) return res.status(404).json({error:'No encontrado'});
    res.json(u);
};

export const updateUser = async (req, res) => {
    const u = await userService.updateUser(req.params.uid, req.body);
    if (!u) return res.status(404).json({error:'No encontrado'});
    res.json(u);
};

export const deleteUser = async (req, res) => {
    const u = await userService.deleteUser(req.params.uid);
    if (!u) return res.status(404).json({error:'No encontrado'});
    res.json({status:'success', deleted:u._id});
};