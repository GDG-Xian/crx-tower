SRC=bower_components
DIST=extension

default:
	@echo "Removing old package..."
	@rm -f package/extension.zip
	@echo "Making new package..."
	@mkdir -p package
	@cd extension && zip -r ../package/extension.zip * 
install:
	@echo 'Copying library: jquery ...'
	@sed '$$d' $(SRC)/jquery/dist/jquery.min.js > $(DIST)/lib/jquery.js