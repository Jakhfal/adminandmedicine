import { NextFunction, Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { log } from "console";
import path from "path";
import fs from "fs"
import { ROOT_DIRECTORY } from "../config";

const prisma = new PrismaClient({errorFormat: "minimal"})
type DrugType = "syrup" | "Tablet" | "Powder"

const createMedicine = async (req: Request, res: Response) => {
    try {
        const name: string = req.body.name
        const stock: number = Number(req.body.stock)
        const expDate: Date = new Date(req.body.exp_date)
        const price: number = Number(req.body.price)
        const type: DrugType = req.body.type
        const photo: string = req.file?.filename || ""

        /** Save a new medicine to DB  */
        const newMedicine = await  prisma.medicine.create({
            data: {
            name: name,
            stock: stock,
            exp_date: expDate,
            type: type as DrugType,
            price: price,
            photo: photo

            }
        })

        return res.status(200)
            .json({
                messeege: `new medicine has been created`,
                data: newMedicine
            })
    } catch (error) {
        console.log(error);
        
        return res.status(500)
            .json(error)
    }
}

const readMedicine = async (
    req: Request,
    res: Response,
) => {
    try {
        const search = req.query.search
        //get on medicine
        const allMedicine = await prisma.medicine.findMany({
            where: {
                OR: [{
                    name: {
                        contains: search?.toString() ||""
                    },
                }
            ]
            }
        })
        return res.status(200).json({
            message : `medicine have been retrieved`,  
            data : allMedicine
        })
    } catch (error) {
        res.status(500)
        .json(error)
    }
}

const updateMedicine = async (req: Request, res: Response) => {
    try {
        /**read "id" of medicine that sent at parameter URL */
        const id = req.params.id
        /**check existing medicine based ono id */
        const findMedicine = await prisma.medicine.findFirst({
            where: { id: Number(id) }
        })

        if (!findMedicine) {
            return res.status(200).json({ message: "Medicine not found" })
        }

        /**check change file or not */
        if (req.file) {
            /**assume that user want to replace photo */

            /**define the old of file name */
            let oldFileName = findMedicine.photo
            /**define path / location of old file */
            let pathFile = `${ROOT_DIRECTORY}/public/medicine-photo/${oldFileName}`
            /**check if file exists */
            let existsFile = fs.existsSync(pathFile)

            if (existsFile && oldFileName !== ``) {
                /**delete old file */
                fs.unlinkSync(pathFile)
            }
        }

        /**read property of medicine from req.body */
        const { name, stock, price, type, exp_date } = req.body

        /**update medicine */
        const saveMedicine = await prisma.medicine.update({
            where: { id: Number(id) },
            data: {
                name: name ?? findMedicine.name,
                stock: stock ? Number(stock) : findMedicine.stock,
                price: price ? Number(price) : findMedicine.price,
                exp_date: exp_date ? new Date(exp_date) : findMedicine.exp_date,
                type: type ? type : findMedicine.type,
                photo: req.file ? req.file.filename : findMedicine.photo
            }
        })

        return res.status(200)
            .json({
                message: `Medicine has been updated`,
                data: saveMedicine
            })
    } catch (error) {
        return res.status(500)
            .json(error)
    }
}

const deleteMedicine = async(req: Request, res: Response) => {
    try {
        //ambil id dari req params
        const id = req.params.id
        //cek existing medicine based on id
        const findMedicine = await prisma.medicine
        .findFirst({where: {
            id: Number(id)
        }})
        if (!findMedicine) {
            return res.status(200)
            .json({
                message: `medicine is not found`
            })
        }

        let oldFileName = findMedicine.photo
            let pathFile = `${ROOT_DIRECTORY}/public/medicine-photo/${oldFileName}`
            let existsFile = fs.existsSync(pathFile)

            if(existsFile && oldFileName !== ``){
                fs.existsSync(pathFile)
            }

        //delete medicine
        const deleteMedicine = await prisma.medicine.delete({
            where: {
                id: Number(id)
            }
        })

        return res.status(200)
        .json({
            message: `medicine has been deleted`,
            data: deleteMedicine
        })

    } catch (error) {
        return res.status(500)
        .json(error)
    }
}

export {createMedicine, readMedicine, updateMedicine, deleteMedicine}