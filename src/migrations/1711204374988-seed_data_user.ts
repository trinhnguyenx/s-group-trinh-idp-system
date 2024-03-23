import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import * as bcrypt from 'bcrypt';

export class SeedDataUser1711204374988 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const userRepository = queryRunner.manager.getRepository(User);
        const roleRepository = queryRunner.manager.getRepository(Role);

        const rolesToCreate = [
            { name: 'admin', description: 'Admin role' },
            { name: 'user', description: 'User role' },
            { name: 'coaching', description: 'Coaching role' }
        ];

        const createdRoles = await Promise.all(
            rolesToCreate.map(async roleData => {
                const role = roleRepository.create(roleData);
                return await roleRepository.save(role);
            })
        );

        const adminRole = createdRoles.find(role => role.name === 'admin');
        const adminUser = new User();
        adminUser.username = 'admin';
        adminUser.password = await bcrypt.hash('admin123', 10);
        adminUser.fullname = 'Admin User';
        adminUser.createdAt = new Date();
        adminUser.email = 'admin@example.com';
        adminUser.roles = [adminRole];

        await userRepository.save(adminUser);

        for (let i = 1; i < 1000; i++) {
            const user = new User();
            user.username = `userSeed${i}`;
            user.password = await bcrypt.hash('123456', 10); 
            user.fullname = `FullnameSeed ${i}`;
            user.createdAt = new Date();
            user.email = `userSeed${i}@example.com`;

            const randomRole = createdRoles[Math.floor(Math.random() * createdRoles.length)];
            user.roles = [randomRole];

            await userRepository.save(user);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }
}
