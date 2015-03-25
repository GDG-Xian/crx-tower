SRC=bower_components
DIST=extension

default:
	@echo "Removing old package..."
	@rm -f package/extension.zip
	@echo "Making new package..."
	@mkdir -p package
	@cd extension && zip -r ../package/extension.zip * 
install:
	@echo "Installing bower components ..."
	@bower install

	@echo 'Copying library: jquery ...'
	@sed '$$d' $(SRC)/jquery/dist/jquery.min.js > $(DIST)/lib/jquery.js
	
	@echo 'Copying library: underscore ...'
	@sed '$$d' $(SRC)/underscore/underscore-min.js > $(DIST)/lib/underscore.js
	
	