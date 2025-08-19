import { Injectable, NotFoundException } from "@nestjs/common";
import { FindOneOptions, Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { RegisterDTO } from "src/auth/dtos/auth.dto";

@Injectable()
export class UsersService {
  private repo: Repository<UserEntity>;
  constructor(
    @InjectRepository(UserEntity) repo: Repository<UserEntity>,
  ) {
    this.repo = repo;
  }

  public async getOneUser(options: FindOneOptions<UserEntity>) {
    const user = await this.repo.findOne(options);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  public async createUser(user: RegisterDTO & {passwordHash: string}) {
    return this.repo.save(this.repo.merge(new UserEntity(), user));
  }
}