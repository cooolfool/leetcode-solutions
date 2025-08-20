class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int m = matrix.length;
        int n = matrix[0].length;
        for(int i=0;i<m;i++){
        int arr[]=matrix[i];
        int low=0;
        int high = arr.length-1;
        while(low<=high){
            int mid = low + (high-low)/2;
            if(arr[mid]==target)
            return true;
            else if(arr[mid]>target){
                high = mid-1;
            }
            else {
                low = mid+1;
            }
        }
        }
                return false;

    }
}