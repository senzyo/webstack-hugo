$scriptPath = $MyInvocation.MyCommand.Path
$parentDir = [System.IO.Path]::GetDirectoryName($scriptPath)
$yamlFile = "$parentDir\data\webstack.yml"

if (!(Test-Path $yamlFile)) {
    Write-Host "File does not exist."
    exit 1
}

$urlList = Select-String -Pattern '(?<=url:).*' -Path $yamlFile | ForEach-Object { $_.Matches.Value.Trim() }
$urlCount = @{}

foreach ($url in $urlList) {
    if ($urlCount.ContainsKey($url)) {
        $urlCount[$url]++
    } else {
        $urlCount[$url] = 1
    }
}

$hasDuplicates = $false

foreach ($url in $urlCount.Keys) {
    $count = $urlCount[$url]
    if ($count -gt 1) {
        Write-Host "$url appears $count times."
        $hasDuplicates = $true
    } 
}

if (!$hasDuplicates) { 
    Write-Host "No duplicate URLs were found."
} 
