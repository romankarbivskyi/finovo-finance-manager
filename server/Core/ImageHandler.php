<?php

namespace server\Core;

class ImageHandler
{
  public static function uploadImage($file)
  {
    if ($file['error'] === UPLOAD_ERR_OK) {
      $tmpName = $file['tmp_name'];
      $name = uniqid() . basename($file['name']);

      $uploadDir = __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR;

      if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
      }

      $uploadFile = $uploadDir . $name;

      if (move_uploaded_file($tmpName, $uploadFile)) {
        return $name;
      } else {
        throw new \Exception("Failed to move uploaded file.");
      }
    } else {
      throw new \Exception("File upload error: " . $file['error']);
    }
  }

  public static function deleteImage($imageName)
  {
    $imagePath = __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . $imageName;
    if (file_exists($imagePath)) {
      unlink($imagePath);
      return true;
    }
  }

  public static function getImageUrl($imageName)
  {
    $imagePath = __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . $imageName;
    if (file_exists($imagePath)) {
      return (getenv("SERVER_DOMAIN") ?: "http://localhost") . "/uploads/" . $imageName;
    } else {
      throw new \Exception("Image not fould");
    }
  }
}