class Solution {
public:
    int maxIceCream(vector<int>& costs, int coins) {
        sort(costs.begin(),costs.end());
        int sum=0,ice=0;
        for(auto it=costs.begin();it<costs.end();it++)
        {
            if(sum+(*it)<=coins)
            {
                ice++;
                sum+=(*it);
            }
        }
        return ice;
    }
};