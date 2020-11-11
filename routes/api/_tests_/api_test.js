import { router } from "../rest";
import { Budget } from "../../../models/budget_schema";
import { User } from "../../../models/user_schema";
import mongoose from 'mongoose'



describe('rest api test', () =>{
    describe('POST /user', async () =>{
        test('Get user details by IP(if exist', async () =>{
            expect.assertions(1)


            const userIP= '192.168.0.1'
            const user = await User.create(({ ipAddress: userIP}));

            const req = {
                'ip' : '192.168.0.1'
            }


            const res = {router.post}
        })
    })
})