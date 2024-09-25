import { Router } from "express";
import { createMedicine, deleteMedicine, readMedicine, updateMedicine } from "../controller/medicinecontroller";
import { createValidation, updateValidation } from "../middleware/medicineValidation";
import { uploadMedicinePhoto } from "../middleware/uploadMedicinePhoto";
import { verifyToken } from "../middleware/authorization";
const router = Router()


router.post(`/:id`, [verifyToken,uploadMedicinePhoto.single(`photo`),createValidation],createMedicine)
router.get(`/`,[verifyToken] ,readMedicine )

//route for update medicine
router.put('/:id', [verifyToken,uploadMedicinePhoto.single(`photo`),updateValidation],updateMedicine)
router.delete(`/:id`, [verifyToken], deleteMedicine)

export default router;