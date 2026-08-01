@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements. See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.
@REM ----------------------------------------------------------------------------

@IF "%__MVNW_ARG0_NAME__%"=="" (SET __MVNW_ARG0_NAME__=%~nx0)
@SET __MVNW_CMD__=
@SET __MVNW_ERROR__=
@SET __MVNW_PSMODULEP_SAVE=%PSModulePath%
@SET PSModulePath=
@FOR /F "usebackq tokens=1* delims==" %%A IN (`powershell -noprofile "& {$scriptDir=Split-Path -Parent $MyInvocation.MyCommand.Definition;$propertiesFile=Join-Path $scriptDir '.mvn\wrapper\maven-wrapper.properties';if(Test-Path $propertiesFile){Get-Content $propertiesFile | Where-Object {$_ -match '='}|ForEach-Object{$k,$v=$_.split('=',2);if($k -eq 'distributionUrl'){Write-Output $v}}}"`) DO (
  SET __MVNW_DISTRIBUTION_URL__=%%A
)
@SET PSModulePath=%__MVNW_PSMODULEP_SAVE%

@powershell -noprofile -ExecutionPolicy Bypass -Command "& { $wrapperDir = Split-Path -Parent $MyInvocation.MyCommand.Definition; $propertiesFile = Join-Path $wrapperDir '.mvn\wrapper\maven-wrapper.properties'; $props = @{}; Get-Content $propertiesFile | Where-Object { $_ -match '=' } | ForEach-Object { $k,$v = $_.split('=',2); $props[$k.Trim()]=$v.Trim() }; $distUrl = $props['distributionUrl']; $fileName = [System.IO.Path]::GetFileName($distUrl); $distName = $fileName -replace '-bin\.zip$',''; $userHome = $env:USERPROFILE; $m2Dir = Join-Path $userHome '.m2\wrapper\dists'; $distDir = Join-Path $m2Dir $distName; $mvnExe = Join-Path $distDir 'bin\mvn.cmd'; if (-not (Test-Path $mvnExe)) { Write-Host 'Downloading Maven...'; New-Item -ItemType Directory -Force $distDir | Out-Null; $zipFile = Join-Path $env:TEMP ($fileName); Invoke-WebRequest -Uri $distUrl -OutFile $zipFile; Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::ExtractToDirectory($zipFile, $distDir); Remove-Item $zipFile; $inner = Get-ChildItem $distDir -Directory | Select-Object -First 1; Get-ChildItem $inner.FullName | Move-Item -Destination $distDir; Remove-Item $inner.FullName; Write-Host 'Maven downloaded.'; }; & $mvnExe $args } -- %*
