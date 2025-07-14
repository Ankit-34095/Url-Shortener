@REM
@REM Copyright 2015 the original author or authors.
@REM
@REM Licensed under the Apache License, Version 2.0 (the "License");
@REM you may not use this file except in compliance with the License.
@REM You may obtain a copy of the License at
@REM
@REM      https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing, software
@REM distributed under the License is distributed on an "AS IS" BASIS,
@REM WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
@REM See the License for the specific language governing permissions and
@REM limitations under the License.
@REM

@IF EXIST "%~dp0java.exe" (
  SET _EXECJAVA="%~dp0java.exe"
) ELSE (
  SET _EXECJAVA="java"
)

@SET DIRNAME=%~dp0
@IF "%DIRNAME%" == "" SET DIRNAME=.
@SET APP_BASE_NAME=%~n0
@SET APP_HOME=%DIRNAME%

@FOR %%i IN ("%APP_HOME%") DO @SET APP_HOME=%%~fwi

@REM Add default JVM options here. You can also use JAVA_OPTS and APPLICATION_OPTS to pass JVM options to this script.
SET DEFAULT_JVM_OPTS="-Xmx64m" "-Xms64m"

@IF EXIST "%APP_HOME%\gradle\wrapper\gradle-wrapper.jar" (
  CALL :runJava %DEFAULT_JVM_OPTS% %JAVA_OPTS% %APPLICATION_OPTS% -classpath "%APP_HOME%\gradle\wrapper\gradle-wrapper.jar" org.gradle.wrapper.GradleWrapperMain %*
) ELSE (
  ECHO.
  ECHO  ERROR: Could not find or access gradlew.bat.
  ECHO  Please ensure that gradlew.bat is available in the current directory.
  ECHO.
  EXIT /B 1
)

@GOTO :EOF

:runJava
"%_EXECJAVA%" %*
@IF %ERRORLEVEL% NEQ 0 (
  EXIT /B %ERRORLEVEL%
)
@GOTO :EOF






