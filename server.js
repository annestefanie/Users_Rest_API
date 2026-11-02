import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express ()

app.use(express.json())

// app.put('/usuarios')
// app.put('/usuarios')
// app.delete('/usuarios')

app.listen(3000)

// criando users

app.post('/usuarios', async (req, res) => {
    await prisma.user.create({
        data: {
            email: req.body.email,
            name: req.body.name,
            age: req.body.age
        }
    })
    
    // users.push(req.body)
    // res.send('okkkk')
    
    res.status(201).json(req.body) // 201 significa que foi criado
})

app.put('/usuarios/:id', async (req, res) => {
    await prisma.user.update({
        where: {
            id: req.params.id
        },
        data: {
            email: req.body.email,
            name: req.body.name,
            age: req.body.age
        }
    })
    
    // users.push(req.body)
    // res.send('okkkk')
    
    res.status(201).json(req.body) // 201 significa que foi criado
})

app.get('/usuarios', async (req, res) => {
    console.log(req)

    let users = []
    if(req.query){
        users = await prisma.user.findMany( {
            where: {
                name: req.query.name
            }
        })
    } else {
        users = await prisma.user.findMany()

    }

    // const users = await prisma.user.findMany()
    res.status(200).json(users)

})  

app.delete('/usuarios/:id', async (req, res) => {
    await prisma.user.delete({
        where: {
            id: req.params.id
        }
    })
    res.status(200).json({message: "USUÁRIO DELETADO COM SUCESSO"})
})
