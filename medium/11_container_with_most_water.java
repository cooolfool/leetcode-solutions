class Solution {
    public int maxArea(int[] height) {
        int left_index=0;
        int right_index=height.length-1;
        int max=0;
        while(left_index<right_index){
            int w = right_index - left_index;
            int h = Math.min(height[left_index],height[right_index]);
            int area = h*w;
            max = Math.max(area,max);
            if(height[right_index]>height[left_index]){
                left_index++;
            }
            else if(height[left_index]>height[right_index]){
                right_index--;
            }
            else{
                left_index++;
                right_index--;
            }
        }
        return max;
    }
}