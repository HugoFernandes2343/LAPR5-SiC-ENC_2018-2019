module.exports = {

    /**
     * Verifies if the child product fits in the parent product.
     * First, verifies the percentages. If by adding the child product
     * we exceed the maximum occupation allowed, then returns false.
     * After that, it verifies if the child product measurements fit in the
     * parent product, taking discrete and continuous measurements into
     * account.
     * 
     * @param {the parent product} parent 
     * @param {the child product to add} child 
     */
    productFits: function (parent, child) {

        var parentHeight = parent.prod_height;
        var parentHeightMax = parent.prod_heightMax;
        var parentWidth = parent.prod_width;
        var parentWidthMax = parent.prod_widthMax;
        var parentDepth = parent.prod_depth;
        var parentDepthMax = parent.prod_depthMax;

        var childHeight = child.prod_height;
        var childHeightMax = child.prod_heightMax;
        var childWidth = child.prod_width;
        var childWidthMax = child.prod_widthMax;
        var childDepth = child.prod_depth;
        var childDepthMax = child.prod_depthMax;

        var maxOccupation = parent.prod_maxOccupation;

        //verify occupation percentage
        if (maxOccupation > 0) {
            var parentVolume = parentHeight * parentWidth * parentDepth;

            var childrenVolume = 0;

            parent.prod_childProds.forEach(element => {
                childrenVolume += element.prod_height
                    * element.prod_width
                    * element.prod_depth;
            });

            childrenVolume += childWidth * childDepth * childHeight;

            var occupation = ((childrenVolume / parentVolume) * 100);

            if (occupation > maxOccupation) return false;
        }

        //verify if height fits
        if (parentHeightMax == 0) {
            if (parentHeight < childHeight) return false;
        } else {
            if (parentHeight < childHeight || childHeightMax > parentHeightMax) return false;
        }

        //verify if width fits
        if (parentWidthMax == 0) {
            if (parentWidth < childWidth) return false;
        } else {
            if (childWidth > parentWidth || childWidthMax > parentWidthMax) return false;
        }

        //verify if depth fits
        if (parentDepthMax == 0) {
            if (parentDepth < childDepth) return false;
        } else {
            if (childDepth > parentDepth || childDepthMax > parentDepthMax) return false;
        }

        return true;
    }
}