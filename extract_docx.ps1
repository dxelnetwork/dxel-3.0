Copy-Item "DXEL_Network_Company_Profile.docx" "temp_archive.zip" -Force
Expand-Archive -Path "temp_archive.zip" -DestinationPath "temp_docx" -Force
[xml]$doc = Get-Content "temp_docx\word\document.xml"
$text = $doc.document.body.InnerText
$text | Out-File "extracted_profile.txt"
Remove-Item -Recurse -Force "temp_docx"
Remove-Item "temp_archive.zip"
