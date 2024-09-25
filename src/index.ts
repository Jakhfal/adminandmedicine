import Express from "express";
import MedicineRoute from "./router/medicineroute";
import adminRoute from "./router/adminRoute";

const app = Express()
//mengijinkan membaca req body dengan format json
app.use(Express.json())

//prefix for medicineroute'
app.use('/medicine', MedicineRoute)

//prefix for admin
app.use('/admin', adminRoute)
const PORT = 1992
app.listen(PORT, () => {
    console.log(`server drugstore run on port ${PORT}`)
})