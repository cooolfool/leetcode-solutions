class Solution {
    public boolean isHappy(int n) {
        int num = n;
    int res  = calculateSum(num);
    System.out.println(res);
       if(res == 1)
       return true;
       return false;
        
    }

    public int calculateSum(int num){
    int sum = 0;
    int size = 0;
        while(num>0){
            int temp = num % 10;
            sum += temp*temp;
            num /= 10;
            size++;
        }



        if(sum >= 10){
           return calculateSum(sum);
        }
        if(sum == 7)
        return 1;

        else return sum;
    }
}