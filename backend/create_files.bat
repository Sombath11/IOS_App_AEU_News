@echo off  
setlocal enabledelayedexpansion  
  
set \"BASE_DIR=%%~dp0\"  
  
REM Create Resources directory  
if not exist \"%%BASE_DIR%%app\Http\Resources\" mkdir \"%%BASE_DIR%%app\Http\Resources\"  
  
echo Creating 13 files... 
