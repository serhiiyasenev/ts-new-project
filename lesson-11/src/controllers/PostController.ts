import { Route, Get, Post, Put, Delete, Query, Path, Body, SuccessResponse, Tags, Controller } from "tsoa";
import * as postService from "../services/posts";
import { queryPostsSchema, createPostSchema, updatePostSchema } from "../schemas/posts";
import { ApiError } from "../types/errors";
import {  PostResponseDto, mapPostModelToDto } from "../dtos/postResponse.dto";
import { validateNumericId, validateWithSchema } from "../helpers/validation";
import { CreatePostDto, UpdatePostDto } from "../dtos/postRequest.dto";
import { PostFilters } from "../types/filters";

@Route("posts")
@Tags("Posts")
export class PostController extends Controller {
  @Get()
  public async getAllPosts(
    @Query() title?: string,
    @Query() content?: string,
    @Query() userId?: string
  ): Promise<PostResponseDto[]> {
    const query = validateWithSchema(
      queryPostsSchema,
      { title, content, userId },
      "Invalid post query parameters"
    );
    const filters: PostFilters = {
      title: query.title,
      content: query.content,
      userId: query.userId,
    };
    const posts = await postService.getAllPosts(filters);
    return posts.map(mapPostModelToDto);
  }

  @Get("{id}")
  public async getPostById(
    @Path() id: string
  ): Promise<PostResponseDto> {
    const postId = validateNumericId(id, "Post id");
    const post = await postService.getPostById(postId);
    if (!post) {
      throw new ApiError("Post not found", 404);
    }
    return mapPostModelToDto(post);
  }

  @Post()
  @SuccessResponse("201", "Created")
  public async createPost(
    @Body() data: CreatePostDto
  ): Promise<PostResponseDto> {
    const payload = validateWithSchema(createPostSchema, data, "Invalid post payload");
    const post = await postService.createPost(payload);
    this.setStatus(201);
    return mapPostModelToDto(post);
  }

  @Put("{id}")
  public async updatePost(
    @Path() id: string,
    @Body() data: UpdatePostDto
  ): Promise<PostResponseDto> {
    const postId = validateNumericId(id, "Post id");
    const payload = validateWithSchema(updatePostSchema, data, "Invalid post update payload");
    const { actorUserId, ...changes } = payload;
    if (!Object.keys(changes).length) {
      throw new ApiError("Update payload cannot be empty", 400);
    }
    const updated = await postService.updatePost(postId, changes, actorUserId);
    if (!updated) {
      throw new ApiError("Post not found", 404);
    }
    return mapPostModelToDto(updated);
  }

  @Delete("{id}")
  @SuccessResponse("204", "No Content")
  public async deletePost(
    @Path() id: string
  ): Promise<void> {
    const postId = validateNumericId(id, "Post id");
    const deleted = await postService.deletePost(postId);
    if (!deleted) {
      throw new ApiError("Post not found", 404);
    }
    this.setStatus(204);
  }
}
