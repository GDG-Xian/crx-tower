default:
	@echo "Removing old package..."
	@rm -f package/extension.zip
	@echo "Making new package..."
	@mkdir -p package
	@cd extension && zip -r ../package/extension.zip * 
