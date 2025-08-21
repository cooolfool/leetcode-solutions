class Solution {

public:

    vector<int> selfDividingNumbers(int left, int right) {

        int rem=0,flag=0;

        vector<int> vec;

        for(int i=left;i<=right;i++)

        {

            int num=i;

            flag=0;

            while(num>0)

            {

               rem=num%10;

               num=num/10;

               if(rem==0 or i%rem!=0)

                {

                    flag=0;

                    break;

                }

                else

                    flag=1;

            }

            if(flag==1)

            vec.push_back(i);

        }

        return vec;

    }

};
        

