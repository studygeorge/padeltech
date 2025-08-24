#!/bin/bash

# Создаем директорию для видео в публичной папке
mkdir -p public/assets/images/characters/cat

# Копируем все видеофайлы
cp src/assets/images/characters/cat/*.mp4 public/assets/images/characters/cat/

echo "Видеофайлы скопированы в публичную директорию"
