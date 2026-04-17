param(
  [Parameter(Mandatory = $true)]
  [string]$StorageAccountName,

  [Parameter(Mandatory = $true)]
  [string]$ResourceGroupName,

  [string]$ContainerName = "ai-images"
)

Write-Host "Creating blob container '$ContainerName' in storage account '$StorageAccountName'..."
az storage container create `
  --name $ContainerName `
  --account-name $StorageAccountName `
  --auth-mode login `
  --public-access blob
