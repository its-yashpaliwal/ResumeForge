package com.resumeforge.dto;

import java.util.UUID;

public record UploadResponse(UUID jobId, String message) { }