import {Route, Get, Post, Put, Delete, Query, Path, Body } from "tsoa";
import * as postService from "../services/posts";
import { queryPostsSchema, PostFilters, CreatePostDto, UpdatePostDto } from "../schemas/posts";
import { ApiError } from "../types/errors";
import {  PostResponseDto, mapPostModelToDto } from "../dtos/postResponse.dto";
import { Tags } from "tsoa";
import { createPositiveNumericIdSchema } from "../helpers/helpers";

@Tags("Posts")
@Route("posts")
export class PostController {
  @Get()
  public async getAllPosts(
    @Query() title?: string,
    @Query() content?: string,
    @Query() userId?: string
  ): Promise<PostResponseDto[]> {
    const query = queryPostsSchema.parse({ title, content, userId });
    const filters: PostFilters = {
      title: query.title,
      content: query.content,
      userId: query.userId ? Number(query.userId) : undefined,
    };
    const posts = await postService.getAllPosts(filters);
    return posts.map(mapPostModelToDto);
  }

  @Get("{id}")
  public async getPostById(
    @Path() id: number
  ): Promise<PostResponseDto> {
    const post = await postService.getPostById(id);
    if (!post) {
      throw new ApiError("Post not found", 404);
    }
    return mapPostModelToDto(post);
  }

  @Post()
  public async createPost(
    @Body() data: CreatePostDto
  ): Promise<PostResponseDto> {
    try {
    createPositiveNumericIdSchema("userId").parse(data.userId);
    } catch (err) {
      throw new ApiError("Invalid userId. Must be positive integer.", 400);
    }
    const post = await postService.createPost(data);
    if (!post) {
      throw new Error("Failed to create post");
    }
    return mapPostModelToDto(post);
  }

  @Put("{id}")
  public async updatePost(
    @Path() id: number,
    @Body() data: UpdatePostDto
  ): Promise<PostResponseDto> {
    try {
    createPositiveNumericIdSchema("userId").parse(data.userId);
    } catch (err) {
      throw new ApiError("Invalid userId. Must be positive integer.", 400);
    }
    const updated = await postService.updatePost(id, data);
    if (!updated) {
      throw new ApiError("Post not found", 404);
    }
    return mapPostModelToDto(updated);
  }

  @Delete("{id}")
  public async deletePost(
    @Path() id: number
  ): Promise<void> {
    try {
    createPositiveNumericIdSchema("userId").parse(id);
    } catch (err) {
      throw new ApiError("Invalid userId. Must be positive integer.", 400);
    }
    const deleted = await postService.deletePost(id);
    if (!deleted) {
      throw new ApiError("Post not found", 404);
    }
  }
}
