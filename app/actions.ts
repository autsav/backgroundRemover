'use server'

import * as fal from "@fal-ai/serverless-client"

export async function removeBackground(imageData: string) {
  // Configure fal client
  fal.config({
    credentials: process.env.FAL_KEY,
  })

  // Convert base64 to URL using fal storage
  const file = await fetch(imageData)
  const blob = await file.blob()
  const url = await fal.storage.upload(blob)

  // Call the fal.ai background removal model
  const result = await fal.subscribe("fal-ai/birefnet", {
    input: {
      image_url: url,
      model: "General Use (Light)",
      operating_resolution: "1024x1024",
      output_format: "png"
    },
  })

  return result
}