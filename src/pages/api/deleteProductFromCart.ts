import {NextApiRequest, NextApiResponse} from 'next';
import { prisma } from '@/db';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req : NextApiRequest, res : NextApiResponse) => {
    if(req.method !== 'POST'){
        return res.status(405).json({message: 'error method'})
    }
    const cartData = JSON.parse(req.body);

    console.log(cartData)

    const newCartData = await prisma.panierProduit.deleteMany({
        where:{
            idProduit: cartData.idProduit,
            idCommande : cartData.idCommande,
        },
    });


const InitialCart = await prisma.commande.findUnique({
        where:{idCommande: cartData.idCommande},
        include: {
            PanierProduit: {include:{
                Produit: true,
            }},
          },});
    
    
    if(InitialCart?.PanierProduit.length === 0){
        await prisma.commande.deleteMany({
            where:{
                idCommande : cartData.idCommande,
            }
        }); 
    }
    
   res.json(InitialCart);
};
