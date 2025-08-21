class Solution {
    public int trap(int[] height) {
       int len = height.length;
       int [] left = new int[len];
       int [] right = new int[len];
       int prevMax = height[0];
       int water = 0;
       for(int i = 0; i<len;i++){
            left[i] = Math.max(prevMax,height[i]);
            if(height[i]>prevMax)
            prevMax = height[i];
       }

       prevMax = height[len-1];
       for(int i = len-1;i>=0;i--){
        right[i]=Math.max(prevMax,height[i]);
       if(height[i]>prevMax)
            prevMax = height[i];
       }

       for(int i= 0;i<len;i++){
        int min = Math.min(left[i],right[i]);
        water += min-height[i];
       }
       return water;
    }
}