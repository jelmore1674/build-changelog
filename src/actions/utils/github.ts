import { getInput } from "@actions/core";
import { getOctokit } from "@actions/github";

const githubToken = getInput("token");

export const restClient = getOctokit(githubToken, { request: { fetch } }).rest;
