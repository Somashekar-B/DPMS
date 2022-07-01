const Departments = require('../models/departments');

exports.getDepartments = async (req, res, next) => {
    try {
        const [allDepartments] =await  Departments.getDepartments();
        res.status(200).send(allDepartments);
    } catch (error) {
        if(!error.statusCode){
            error.statusCode = 500
        }
        next(error);
    }
};

exports.addDepartment = async (req, res, next) => {
    try {
        const [newDepartment] = await Departments.addDepartment(req.body);
        res.status(201).json(newDepartment);
    } catch (error) {
        if(!error.statusCode){
            error.statusCode = 500
        }
        next(error);
    }
};

exports.updateDepartment = async (req, res, next) => {
    try {
        const [updateDepartment] = await Departments.updateDepartment(req.body);
        res.status(201).json(updateDepartment);
    } catch (error) {
        if(!error.statusCode){
            error.statusCode = 500
        }
        next(error);
    }
};

exports.deleteDepartment = async (req, res, next) => {
    try {
        const [deleteDepartment] = await Departments.deleteDepartment(req.params.depCode);
        res.status(200).json(deleteDepartment);
    } catch (error) {
        if(!error.statusCode){
            error.statusCode = 500
        }
        next(error);
    }
};