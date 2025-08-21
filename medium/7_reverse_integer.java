class Solution {
    public int reverse(int x) {
        int neg = x<0 ? -1 : 1;  
      var temp = Math.abs(x);
      var res= 0;
      while(temp>0){
        var flag = temp %10;
        if(res > (Integer.MAX_VALUE - flag) / 10)
        return 0;
        res = res*10 + flag;
        temp /= 10;
      }
    //  System.out.println("Res for X " + res + " " + x);
    //     if(res< Integer.MAX_VALUE && res>= Integer.MIN_VALUE){
    //     return res*neg;
    //   }
        return res*neg;
    }
}